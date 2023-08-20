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
            console.log("PLAY");
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
                    var currentChord = "";
                    const threshold = 0.0;
                    for (const i in beats) {
                        const beat = beats[i];
                        if (chords.length > 0) {
                            if (beat[0] - threshold > chords[0]["timestamp"]) {
                                currentChord = chords[0]["chord"];
                                chords.shift();
                            } else {
                                currentChord = ""
                            }
                        }
                        if (beat[1] === 1) {
                            measureNumber += 1;
                        }
                        songStructure.push({
                            timestamp: beat[0],
                            beatNumber: beat[1],
                            chord: currentChord,
                            measureNumber: measureNumber,
                        });
                    }
                    selfClass.songStructure = songStructure;
                    return selfClass
                })
        })
    }
}
