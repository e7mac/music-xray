import SpotifyWebApi from 'spotify-web-api-js';

export default class SpotifyPlayer {
	constructor(spotify, api) {
        this.spotify = spotify;
        this.api = api;
	}

    playPause() {
        if (this.is_playing) {
            this.spotify.pause();
            this.pause_time = this.getProgress();
            this.is_playing = false;
        } else {
            this.spotify.play();
            this.is_playing = true;
        }
    }

    seekToMeasure(index) {

        var time_ms = 0;
        for (var i=0;i<this.songStructure.length;i++) {
            const beat = this.songStructure[i];
            if (beat.measureNumber == index) {
                time_ms = Math.floor(beat.timestamp * 1000);
                i = this.songStructure.length;
            }
        }

        console.log(time_ms);
        this.spotify.seek(time_ms);
    }

    getProgress() {
        if (this.is_playing) {
            // return (new Date().getTime() - this.timestamp) / 1000;
            return (new Date().getTime() - this.request_timestamp + this.progress_ms) / 1000;
        } else {
            return this.pause_time;
        }
    }

    refreshCurrentTrack() {
        const selfClass = this;
        return this.spotify.getMyCurrentPlayingTrack().then((data) => {
            const artist = data.item.artists[0].name;
            const album = data.item.album.name.replace(":","□");
            const track = data.item.name;
            selfClass.artist = artist;
            selfClass.album = album;
            selfClass.track = track;
            selfClass.data = data;
            selfClass.is_playing = data.is_playing;
            selfClass.duration = data.duration_ms * 1000;
            selfClass.api.getChords(track,artist,album).then((chords) => {
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
                            if (chord.timestamp >= beat.timestamp
                            && chord.timestamp < nextBeat.timestamp) {
                                // beat.chords.push(chord.chord);
                                beat.chord = chord.chord;
                            }
                        }
                    }
                    selfClass.songStructure = songStructure;
                    if (selfClass.timestamp !== data.timestamp) {
                        selfClass.timestamp = data.timestamp;
                        selfClass.progress_ms = data.progress_ms;
                        selfClass.request_timestamp = new Date().getTime();
                    }
                    return selfClass
                })
            })
        })
    }
}
