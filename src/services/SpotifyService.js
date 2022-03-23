import SpotifyWebApi from 'spotify-web-api-js';

export default class SpotifyService {
	constructor() {
        this.spotifyApi = new SpotifyWebApi();
        console.log(this.spotifyApi)
        this.spotifyApi.setAccessToken("BQCnqFvjDuhcfwNHm08J1mFgOwbejW0OD7Sj2IvfGHz-tCngNBj8hBpJnblydS_MquNS2nyPQxABBw4hxi8uwS_vCcCI9g-aj__zhk41xdL6Xs1fifp6TiN5Sz9u4NfXKaMbY-xwWuWGhR-4FKk");
	}

    getMyCurrentPlayingTrack() {
        return this.spotifyApi.getMyCurrentPlayingTrack()
    }
}
