import SpotifyWebApi from 'spotify-web-api-js';

export default class SpotifyService {
	constructor(code) {
        this.spotifyApi = new SpotifyWebApi();
        this.client_id = "c7ceddc193814288b0559ca594aa0184";
        this.client_secret = "b4b1a3a5438d49bda0fe9d95b1a16e3a";
        this.getToken(code);
	}

    getToken(code) {
        const selfClass = this;
        var details = {
            'grant_type': 'authorization_code',
            'code': code,
            // 'redirect_uri': 'http://localhost:3000/',
            'redirect_uri': 'https://github.com/e7mac/music-xray',
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        const auth = `${this.client_id}:${this.client_secret}`
        formBody = formBody.join("&");
        fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(auth)}`
        },
        body: formBody
        })
        .then(function(response) { return response.json(); })
        .then( (json) => {
            if (json.access_token !== undefined) {
                selfClass.spotifyApi.setAccessToken(json.access_token);
            }
        });
    }

    getMyCurrentPlayingTrack() {
        return this.spotifyApi.getMyCurrentPlayingTrack()
    }

    play() {
        return this.spotifyApi.play()
    }

    pause() {
        return this.spotifyApi.pause()
    }

    seek(time_ms) {
        return this.spotifyApi.seek(time_ms);
    }
}
