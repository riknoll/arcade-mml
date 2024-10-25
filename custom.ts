namespace mml {
    enum PlayMode {
        Normal,
        Staccato,
        Legato
    }

    enum NoteModifier {
        None,
        Sharp,
        Flat
    }

    const SCHEDULE_AHEAD_MILLIS = 1000;

    class State {
        protected players: MMLPlayer[];

        constructor() {
            this.players = [];

            game.onUpdate(() => {
                for (const player of this.players) {
                    player.update();
                }
            })
        }

        addActivePlayer(player: MMLPlayer) {
            if (this.players.indexOf(player) === -1) {
                this.players.push(player);
            }
        }

        removePlayer(player: MMLPlayer) {
            this.players.removeElement(player);
        }
    }

    function __createState() {
        return new State();
    }

    function state() {
        return __util.getState(__createState);
    }

    export class MMLPlayer {

        protected tracks: MMLTrack[];

        constructor(protected isCancelled: () => boolean) {
            this.tracks = [];
        }

        addTrack(track: string, instrument: music.sequencer.Instrument) {
            this.tracks.push(new MMLTrack(track, instrument));
        }

        play() {
            state().addActivePlayer(this);
            const time = game.runtime();
            for (const track of this.tracks) {
                track.play(time);
            }
        }

        update() {
            if (this.isCancelled()) {
                for (const track of this.tracks) {
                    track.cancel();
                }
            }
            else {
                for (const track of this.tracks) {
                    track.update();
                }
            }

            if (this.isFinished()) {
                state().removePlayer(this);
            }
        }

        isFinished() {
            if (this.isCancelled()) {
                return true;
            }
            
            for (const track of this.tracks) {
                if (!track.isFinished()) {
                    return false;
                }
            }

            return true;
        }
    }

    class MMLTrack {
        index: number;
        tempo: number;
        octave: number;
        defaultNoteDuration: number;
        mode: PlayMode;
        nextNoteTime: number;
        startTime: number;
        finished: boolean;
        volume: number;

        constructor(protected src: string, protected instrument: music.sequencer.Instrument) {
            this.reset();
            this.finished = true;
        }

        play(startTime: number) {
            this.reset();
            this.startTime = startTime;
            this.readToken();
        }

        reset() {
            this.startTime = game.runtime();
            this.nextNoteTime = 0;
            this.tempo = 120;
            this.defaultNoteDuration = 4;
            this.index = 0;
            this.octave = 4;
            this.mode = PlayMode.Normal;
            this.finished = false;
            this.volume = 8;
        }

        cancel() {
            this.finished = true;
            this.index = this.src.length;
            this.nextNoteTime = 0;
            this.startTime = 0;
        }

        update() {
            while (!this.finished && this.nextNoteTime < this.elapsed() + SCHEDULE_AHEAD_MILLIS) {
                this.readToken();
            }
        }

        elapsed() {
            return game.runtime() - this.startTime;
        }

        isFinished() {
            return this.index >= this.src.length && this.elapsed() > this.nextNoteTime
        }

        protected readToken() {
            if (!this.eatWhitespaceAndCheckLength()) {
                this.finished = true;
                return;
            }

            const current = this.src.charAt(this.index).toLowerCase();
            this.index++;

            switch (current) {
                case "l":
                    this.defaultNoteDuration = this.readNumber();
                    this.readToken();
                    break;
                case "t":
                    this.tempo = this.readNumber();
                    this.readToken();
                    break;
                case "v":
                    this.volume = this.readNumber();
                    this.readToken();
                    break;
                case "o":
                    this.octave = this.readNumber();
                    this.readToken();
                    break;
                case ">":
                    this.octave++;
                    this.readToken();
                    break;
                case "<":
                    this.octave--;
                    this.readToken();
                    break;
                case "m":
                    this.readPlayMode();
                    this.readToken();
                    break;
                case "n":
                    if (this.eatWhitespaceAndCheckLength()) {
                        const note = this.readNumber();
                        this.playNote(note, this.readDuration());
                    }
                    break;
                case "p":
                case "r":
                    this.playRest(this.readDuration());
                    break;
                default:
                    this.readNote(current);
                    break;
            }
        }

        protected readNumber() {
            let num = "";
            let current: string;

            while (isNumber(current = this.src.charAt(this.index))) {
                num += current;
                this.index++;

                if (this.index >= this.src.length) {
                    break;
                }
            }

            return parseInt(num);
        }

        protected readPlayMode() {
            if (this.eatWhitespaceAndCheckLength()) {
                const current = this.src.charAt(this.index).toLowerCase();
                this.index++;

                if (current === "n") {
                    this.mode = PlayMode.Normal;
                }
                else if (current === "s") {
                    this.mode = PlayMode.Staccato;
                }
                else if (current === "l") {
                    this.mode = PlayMode.Legato;
                }
                else {
                    // ignore error
                    this.index--;
                }
            }
        }

        protected readNote(letter: string) {
            if ("abcdefg".indexOf(letter) === -1) {
                this.readToken();
                return;
            }

            let modifier = NoteModifier.None;
            if (this.eatWhitespaceAndCheckLength()) {
                const current = this.src.charAt(this.index);

                if (current === "+" || current === "#") {
                    modifier = NoteModifier.Sharp;
                    this.index++;
                }
                else if (current === "-") {
                    modifier = NoteModifier.Flat;
                    this.index++;
                }
            }
            const duration = this.readDuration();

            this.playNote(getNoteNumber(this.octave, letter, modifier), duration);
        }

        protected readDuration() {
            let duration = this.defaultNoteDuration;
            let multiplier = 1;

            if (this.eatWhitespaceAndCheckLength()) {
                if (isNumber(this.src.charAt(this.index))) {
                    duration = this.readNumber();
                }

                if (this.eatWhitespaceAndCheckLength()) {
                    let current: string;
                    while ((current = this.src.charAt(this.index)) === ".") {
                        multiplier *= 3/2;
                        this.index++;
                        
                        if (this.index >= this.src.length) {
                            break;
                        }
                    }
                }
            }

            return getNoteLength(this.tempo, duration) * multiplier;
        }

        protected playNote(noteNumber: number, duration: number) {
            const gateLength = getGateLength(duration, this.mode);
            const frequency = music.lookupFrequency(noteNumber);

            const instructions = music.sequencer.renderInstrument(
                this.instrument,
                frequency,
                gateLength,
                (Math.clamp(0, 15, this.volume) / 15) * music.volume()
            );

            music.playInstructions(this.nextNoteTime - this.elapsed(), instructions);

            this.nextNoteTime += duration;
        }

        protected playRest(duration: number) {
            this.nextNoteTime += duration;
        }

        protected eatWhitespaceAndCheckLength() {
            while (this.index < this.src.length && isWhitespace(this.src.charAt(this.index))) {
                this.index++;
            }

            return this.index < this.src.length;
        }
    }

    function isNumber(a: string) {
        return "0123456789".indexOf(a) !== -1;
    }

    function isWhitespace(a: string) {
        return " \t\n\r".indexOf(a) !== -1;
    }

    function getGateLength(noteLength: number, mode: PlayMode) {
        if (mode === PlayMode.Normal) {
            return noteLength * 7 / 8;
        }
        else if (mode === PlayMode.Staccato) {
            return noteLength * 3 / 4;
        }
        else {
            return noteLength;
        }
    }

    function getNoteLength(tempo: number, length: number) {
        return (60000 / tempo) * (4 / length);
    }

    function getNoteNumber(octave: number, note: string, modifier: NoteModifier) {
        let offset = "c_d_ef_g_a_b".indexOf(note);

        if (modifier === NoteModifier.Sharp) {
            offset++;
        }
        else if (modifier === NoteModifier.Flat) {
            offset--;
        }

        return octave * 12 + offset;
    }
}
