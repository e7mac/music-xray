class AudioURLPlayer {
    constructor(api, track, artist, album) {
        this.api = api;
        this.artist = artist;
        this.track = track;
        this.album = album;
        const url = api.getAudioURL(track, artist, album);
        console.log(url);
        this.audio = new Audio(url);
        this.isPlaying = false;
        this.songStructure = [];
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
        const beat = this.songStructure.find((beat) => beat.measureNumber === index);
        if (beat) {
            const time_ms = Math.floor(beat.timestamp * 1000);
            console.log(time_ms);
            this.audio.currentTime = time_ms / 1000;
        }
    }

    getCurrentTime() {
        return this.audio.currentTime;
    }

    getDuration() {
        return this.audio.duration;
    }

    async refreshCurrentTrack() {
        const songStructure = await this.api.getSongStructure(this.track, this.artist, this.album);
        this.songStructure = songStructure;
        return this;
    }
}

export default AudioURLPlayer;
