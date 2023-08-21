import React, { Component } from 'react';

class AudioPlayerControl extends Component {
    constructor(props) {
        super(props);
        this.sliderRef = React.createRef();
        this.state = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
        };
    }

    buttonClicked = () => {
        this.props.player.playPause();
        this.setState((prevState) => ({
            isPlaying: !prevState.isPlaying,
        }));
    }

    componentDidMount() {
        this.updateTimeInterval = setInterval(() => {
            const currentTime = this.props.player.getCurrentTime();
            const duration = this.props.player.getDuration();
            this.setState({ currentTime, duration });
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.updateTimeInterval);
    }

    render() {
        const { isPlaying, currentTime, duration } = this.state;
        return (
            <div>
                <button type="button" onClick={this.buttonClicked}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <progress
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100 || 0}
                    ref={this.sliderRef}
                />
                <span className="time-label">
                    {new Date(currentTime * 1000).toISOString().substr(14, 5)} /{' '}
                    {new Date(duration * 1000).toISOString().substr(14, 5)}
                </span>
            </div>
        );
    }
}

export default AudioPlayerControl;
