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
