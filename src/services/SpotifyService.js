import SpotifyWebApi from 'spotify-web-api-js';

export default class SpotifyService {
	constructor() {
        this.spotifyApi = new SpotifyWebApi();
        console.log(this.spotifyApi)
        this.spotifyApi.setAccessToken("BQDWcRzx4JGUUtK8cE5JKs_I8yCW_wZ_a09PiMK4sFDBDztCiWgDNL7eSL3ZaRnI2PMBf0GTvp3DFl6IwqU3fiuhTSoHm_sq_ywkWPvRJQKrLZD4G2fiTURoWOMcaDSgxgGvz_1GIOBv3t4pLZc");
	}

    getMyCurrentPlayingTrack() {
        return this.spotifyApi.getMyCurrentPlayingTrack()
    }
}
