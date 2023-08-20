import React from 'react';

export default class AudioPlayerControl extends React.Component {
	constructor(props) {
		super(props);
		this.buttonClicked = this.buttonClicked.bind(this);
		this.sliderRef = React.createRef();
		this.state = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
        };		
	}

	buttonClicked() {
		this.props.player.playPause()
		this.setState({
			isPlaying: this.props.player.isPlaying
		});
	}

	componentDidMount() {
        const selfClass = this;
        setInterval(function() {
			selfClass.setState({
				currentTime: selfClass.props.player.getCurrentTime(),
				duration: selfClass.props.player.getDuration(),
			});
        }, 1000);
	}

	render() {
		return (
            <div>
                <button type="button" onClick={this.buttonClicked}>
					{this.state.isPlaying ? 'Pause' : 'Play'}
				</button>
				<progress
                    min="0"
                    max="100"
                    value={(this.state.currentTime / this.state.duration) * 100 || 0}
                    ref={this.sliderRef}
                />
                <span className="time-label">
                    {new Date(this.state.currentTime * 1000).toISOString().substr(14, 5)} /{' '}
                    {new Date(this.state.duration * 1000).toISOString().substr(14, 5)}
                </span>				
            </div>
		);
	}
}
