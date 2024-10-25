//% color=#4a5e80 icon="\uf001" block="MML"
namespace mml {
    export class MMLTrack {
        constructor(
            public mml: string,
            public inst: MMLInstrument
        ) {}
    }

    export class MMLPlayable extends music.Playable {
        constructor(protected tracks: MMLTrack[]) {
            super();
        }

        play(playbackMode: music.PlaybackMode) {
            this.stopped = false;

            const player = new MMLPlayer(() => this.stopped);
            for (const track of this.tracks) {
                player.addTrack(track.mml, track.inst.inst);
            }
            if (playbackMode === music.PlaybackMode.LoopingInBackground) {
                this.loop();
            }
            else {
                player.play();

                if (playbackMode === music.PlaybackMode.UntilDone) {
                    pauseUntil(() => player.isFinished());
                }
            }
        }
    }

    //% blockId=mmlPlayer_playable
    //% block="MML song|$track1||$track2 $track3 $track4 $track5 $track6 $track7 $track8 $track9"
    //% track1.shadow=mmlPlayer_track
    //% track2.shadow=mmlPlayer_track
    //% track3.shadow=mmlPlayer_track
    //% track4.shadow=mmlPlayer_track
    //% track5.shadow=mmlPlayer_track
    //% track6.shadow=mmlPlayer_track
    //% track7.shadow=mmlPlayer_track
    //% track8.shadow=mmlPlayer_track
    //% track9.shadow=mmlPlayer_track
    //% toolboxParent=music_playable_play
    //% toolboxParentArgument=toPlay
    //% weight=100
    export function playable(
        track1: MMLTrack,
        track2?: MMLTrack,
        track3?: MMLTrack,
        track4?: MMLTrack,
        track5?: MMLTrack,
        track6?: MMLTrack,
        track7?: MMLTrack,
        track8?: MMLTrack,
        track9?: MMLTrack,
    ) {
        const tracks = [track1, track2, track3, track4, track5, track6, track7, track8, track9].filter(t => !!t);

        return new MMLPlayable(tracks);
    }

    //% blockId=mmlPlayer_track
    //% block="instrument $instrument track $mml"
    export function track(instrument: MMLInstrument, mml: string) {
        return new MMLTrack(mml, instrument);
    }
}