import React from 'react';

export default class ChordChart extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
        this.audioRef = React.createRef();
        this.client_id = 'c7ceddc193814288b0559ca594aa0184'; // Your client id
        this.client_secret = 'b4b1a3a5438d49bda0fe9d95b1a16e3a'; // Your secret
        // this.redirect_uri = 'http://localhost:3000/'; // Your redirect uri
        this.redirect_uri = 'https://github.com/e7mac/music-xray';
        this.scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        this.state = {
        }
	}

	componentDidMount() {
        this.authorize();
	}

	componentDidUpdate() {
	}

    authorize() {
        const address = 'https://accounts.spotify.com/authorize?' +
            'response_type=code'
            + '&client_id=' + this.client_id
            + '&scope=' + this.scopes
            + '&redirect_uri=' + this.redirect_uri
        window.location.href = address;
    }
	render() {
		return (
            <div>
                <div id="login">
                <h1>First, log in to spotify</h1>
                <a href="/login">Log in</a>
                </div>
                <div id="loggedin">
                </div>
            </div>
		);
	}
}
