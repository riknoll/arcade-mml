# arcade-mml

A MakeCode Arcade extension for playing songs written in [Music Macro Language](https://en.wikipedia.org/wiki/Music_Macro_Language).

This extension also contains all of the instruments from the Arcade music editor (except drums).

## Syntax

A `#` in the below table represents a symbol that takes in a numerical argument

| Symbol      | Purpose
|-------------|------------------- 
| `ABCDEFG`   | Plays a note in the current octave. See "Notes" below for full syntax
| `P` or `R`  | Plays a rest. See "Rests" below for full syntax
| `O#`        | Sets the current octave. Ranges from 0-7 and defaults to 4
| `L#`        | Sets the default duration of notes that come after this. See "Durations" below for the meaning of the number argument. Defaults to 4
| `T#`        | Sets the tempo (in beats per minute). Defaults to 120
| `V#`        | Sets the volume of all notes that come after this. Ranges from 0-15. Defaults to 8
| `>`         | Steps up one octave
| `<`         | Steps down one octave
| `.`         | When following a note, makes that note longer. See "Durations" below for more info
| `+` or `#`  | When following a note, makes that note sharp
| `-`         | When following a note, makes that note flat
| `MS`        | Changes the play mode to Staccato. See "Play Mode" below for more info
| `MN`        | Changes the play mode to Normal. See "Play Mode" below for more info
| `ML`        | Changes the play mode to Legato. See "Play Mode" below for more info
| `N#`        | Plays a note corresponding to the MIDI note number of the number argument. Using this syntax is not recommended because you cannot control the length of the note (except by using `L`)

### Notes

To play a note in the current octave, use the letter of the note. You can make the note sharp or flat by using `+` and `-` respsectively. You can control how long the note plays by placing a number or `.` after the note. See "Durations" below for more info on how those arguments work.

For example, if I wanted to play a C# for 1 beat (1/4 note), I would write it like this:

```
C+4
```

Or if I wanted to play a D flat note for the default note length, I would simply write:

```
D-
```

### Rests

Rests are written using `P` or `R`. You can change the length of the rest by placing a number or `.` after the note. See "Durations" below for more info on how those arguments work.

### Durations

Durations in MML are written using the denominator of the note you want to play. Here's a table of common note lengths and the duration values for each:

| Note                  | Fraction | MML Value
|-----------------------|----------|----------
| Whole                 | 1/1      | `1`
| Half                  | 1/2      | `2`
| Quarter               | 1/4      | `4`
| Eighth                | 1/8      | `8`
| Sixteenth             | 1/16     | `16`
| Thirty-Second         | 1/32     | `32`
| Sixty-Fourth          | 1/64     | `64`
| Eighth Triplet        | 1/8t     | `12`
| Sixteenth Triplet     | 1/16t    | `24`
| Thirty-Second Triplet | 1/32t    | `48`
| Sixty-Fourth Triplet  | 1/64t    | `96`

For example, if you wanted to play a G with the duration of a 1/64th note, you would write:

```
G64
```

You can also extend the duration of a note/rest by placing a `.` after it. A `.` will cause the duration value to be multipied by `3/2`. For example:

```
R64.
```

Would result in a rest that extends for `(1/64) * (3/2) = 3/128` of a measure.

You can also chain `.`s together to create longer durations. For example:

```
C+...
```

Would cause a C# note to play for the default note duration times `3/2 * 3/2 * 3/2 = 27/8`.

### Play Mode

There are three play modes that affect how long notes play for (the defualt mode is normal):

| Mode     | Syntax | Meaning
|----------|--------|--------
| Normal   | `MN`   | Notes play for 7/8 the calculated duration
| Staccato | `MS`   | Notes play for 3/4 the calculated duration
| Legato   | `ML`   | Notes play for the entire calculated duration

Changing the play mode only affects how long a note actually produces sound; it does not affect the timing of the song. For example, if a 1/4 note is played staccato, the song will still wait for the entire 1/4 note to pass before moving on to the next note in the sequence.

## Supported targets

* for PXT/arcade
* for PXT/arcade
(The metadata above is needed for package search.)
