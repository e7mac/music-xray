import React from 'react';

export default class SpotifyPlayerControl extends React.Component {
	constructor(props) {
		super(props);
		this.buttonClicked = this.buttonClicked.bind(this);
		this.seek = this.seek.bind(this);
		this.sliderRef = React.createRef();
	}

	buttonClicked() {
		this.props.player.playPause()
	}

	seek() {
		const slider = this.sliderRef.current;
		console.log("SEEK")
		console.log(slider.value/100)
		this.props.spotify.seek(slider.value / 100)
	}

	render() {
		return (
            <div>
                <button type="button" onClick={this.buttonClicked}>Play</button>
                <input type="range" min="0" max="100" ref={this.sliderRef} onChange={this.seek}/>
            </div>
		);
	}
}
