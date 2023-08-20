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
        if (!this.isPlaying) {
            this.audio.play();
            this.isPlaying = true;
        } else {
            this.audio.pause();
            this.isPlaying = false;
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

    getCurrentTime() {
        return this.audio.currentTime;
    }

    getDuration() {
        return this.audio.duration;
    }

    refreshCurrentTrack() {
        const selfClass = this;
        const track = this.track
        const artist = this.artist
        const album = this.album
        return this.api.getSongStructure(track, artist, album).then((songStructure) => {
            selfClass.songStructure = songStructure;
            return selfClass;            
        })
    }
}
