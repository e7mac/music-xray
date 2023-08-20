export default class APIService {
	constructor() {
		this.baseUrl = "https://real-music-learning-tools-data.s3.amazonaws.com/"
	}

	async getBeats(track, artist, album) {
        const path = `${this.urlConstruct(track, artist, album)}-beats.json`;
        try {
            const response = await this.apiCall(path);
            return response;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

	async getChords(track, artist, album) {
        const path = `${this.urlConstruct(track, artist, album)}-chords.json`;
        try {
            const response = await this.apiCall(path);
            return response;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

	async getSongStructure(track, artist, album) {
        try {
            const chords = await this.getChords(track, artist, album);
            const beats = await this.getBeats(track, artist, album);
            const songStructure = [];
            let measureNumber = 0;
            let currentChord = "";
            const threshold = 0.0;
            for (const beat of beats) {
                if (chords.length > 0) {
                    if (beat[0] - threshold > chords[0]["timestamp"]) {
                        currentChord = chords[0]["chord"];
                        chords.shift();
                    } else {
                        // currentChord = "";
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
            return songStructure;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }
	
    getAudioURL(track, artist, album) {
        return `${this.baseUrl}${this.urlConstruct(track, artist, album)}.mp3`
    }
    urlConstruct(track, artist, album) {
        return `songs/${artist}/${album}/${artist} - ${track}`
    }

	async apiCall(path, params = {}, searchParams = {}, json = true) {
        const url = new URL(`${this.baseUrl}${path}`);
        const request = fetch(url);
        try {
            const response = await request;
            if (json) {
                const jsonResponse = await response.json();
                if (jsonResponse["detail"] !== undefined) {
                    console.log(`LOGOUT from: ${url}`);
                    localStorage.removeItem("token");
                    window.location.reload();
                }
                return jsonResponse;
            } else {
                return response;
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }
}
