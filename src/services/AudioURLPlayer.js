export default class AudioURLPlayer {
	constructor(api, track, artist, album) {
        this.api = api;
        this.artist = artist
        this.track = track
        this.album = album
        const url = api.getAudioURL(track, artist, album)
        console.log(url)
        this.audio = new Audio(url);
	}

    playPause() {
        if (this.is_playing) {
            this.audio.play();
            this.is_playing = false;
        } else {
            this.audio.pause();
            this.is_playing = true;
        }
    }

    seekToMeasure(index) {
        var time_ms = 0;
        for (var i=0;i<this.songStructure.length;i++) {
            const beat = this.songStructure[i];
            if (beat.measureNumber === index) {
                time_ms = Math.floor(beat.timestamp * 1000);
                i = this.songStructure.length;
            }
        }
        console.log(time_ms);
        this.audio.currentTime = time_ms / 1000;
    }

    getProgress() {
        return this.audio.currentTime;
    }

    refreshCurrentTrack() {
        const selfClass = this;
        const track = this.track
        const artist = this.artist
        const album = this.album
        return this.api.getChords(track, artist, album).then((chords) => {
                selfClass.chords = chords;
                selfClass.api.getBeats(track,artist,album).then((beats) => {
                    selfClass.beats = beats;
                    var songStructure = [];
                    var measureNumber = 0;
                    for (const i in beats) {
                        const beat = beats[i];
                        if (beat[1] === 1) {
                            measureNumber += 1;
                        }
                        songStructure.push({
                            timestamp: beat[0],
                            beatNumber: beat[1],
                            measureNumber: measureNumber,
                        });
                    }

                    for (var i=0; i<chords.length ;i++) {
                        const chord = chords[i];
                        for (var j=0; j<songStructure.length - 1 ;j++) {
                            const beat = songStructure[j];
                            const nextBeat = songStructure[j+1];
                            if (chord.timestamp - beat.timestamp >= 0.1
                            && chord.timestamp < nextBeat.timestamp) {
                                // beat.chords.push(chord.chord);
                                beat.chord = chord.chord;
                            }
                        }
                    }
                    selfClass.songStructure = songStructure;
                    return selfClass
                })
        })
    }
}
