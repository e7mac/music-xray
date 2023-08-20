export default class APIService {
	constructor() {
		this.baseUrl = "https://real-music-learning-tools-data.s3.amazonaws.com/"
	}

	getBeats(track, artist, album) {
        const path = `${this.urlConstruct(track, artist, album)}-beats.json`
		return this.apiCall(path)
			.then(response => {
				return response
			})
			.catch(error => console.log("error: " + error));
	}

	getChords(track, artist, album) {
        const path = `${this.urlConstruct(track, artist, album)}-chords.json`
		return this.apiCall(path)
			.then(response => {
				return response
			})
			.catch(error => console.log("error: " + error));
	}

	getChart(track, artist, album) {
        const path = `${this.urlConstruct(track, artist, album)}-chart.json`
		return this.apiCall(path)
			.then(response => {
				return response
			})
			.catch(error => console.log("error: " + error));
	}

	getSongStructure(track, artist, album) {
		return new Promise((resolve, reject) => {
			const selfClass = this;
			this.getChords(track, artist, album)
				.then((chords) => {
					selfClass.getBeats(track, artist, album)
						.then((beats) => {
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
										currentChord = "";
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
							console.log(songStructure)
							resolve(songStructure);
						})
				})
				.catch(error => console.log("error: " + error));
		});
	}
	
    getAudioURL(track, artist, album) {
        return `${this.baseUrl}${this.urlConstruct(track, artist, album)}.mp3`
    }
    urlConstruct(track, artist, album) {
        return `songs/${artist}/${album}/${artist} - ${track}`
    }

	apiCall(path, params = {}, searchParams = {}, json = true) {
		const url = new URL(`${this.baseUrl}${path}`)
		const request = fetch(url)
		if (json) {
			return request
				.then(res => {
					return res.json()
				})
				.then(res => {
					if (res["detail"] !== undefined) {
						console.log(`LOGOUT from: ${url}`)
						localStorage.removeItem('token');
						window.location.reload()
					}
					return res
				})
		} else {
			return request
		}

	}
}
