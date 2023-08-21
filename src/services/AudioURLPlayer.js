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
        this.cachedSongStructurePromise = null;
        this.startTime = null; // Added property for startTime
        this.endTime = null; // Added property for endTime
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

    seekToTime(time) {
        console.log(time, "here")
        this.audio.currentTime = time;
    }

    setLoopTime(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.audio.currentTime = startTime;
        this.audio.addEventListener('timeupdate', () => {
            if (this.audio.currentTime >= endTime) {
                this.audio.currentTime = startTime;
            }
        });
    }

    getCurrentTime() {
        return this.audio.currentTime;
    }

    getDuration() {
        return this.audio.duration;
    }

    async songStructure() {
        if (this.cachedSongStructurePromise) {
            return this.cachedSongStructurePromise;
        }

        this.cachedSongStructurePromise = this.api.getSongStructure(this.track, this.artist, this.album)
            .then((songStructure) => {
                this.songStructure = songStructure;
                return songStructure;
            })
            .finally(() => {
                this.cachedSongStructurePromise = null;
            });

        return this.cachedSongStructurePromise;
    }
}

export default AudioURLPlayer;
