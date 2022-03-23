import SpotifyWebApi from 'spotify-web-api-js';

export default class SpotifyService {
	constructor() {
        this.spotifyApi = new SpotifyWebApi();
        console.log(this.spotifyApi)
        this.spotifyApi.setAccessToken("BQDSs-hQHm-cnadPUHtAhmSf8bGlNFSucwX-AcD3MMXYTn2NPNxQhurjOaYwuv-F0yDyuIBUx6n3A1tl6P4uHhHhggjW6smVemxSZWxYjapsl5bT20L68_RAr7xtfawX-1cZMJBXlAtdZlvc7a4");
	}

    getMyCurrentPlayingTrack() {
        return this.spotifyApi.getMyCurrentPlayingTrack()
    }
}
