import React from 'react';

export default class ChordChart extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
        this.audioRef = React.createRef();
        this.state = {
            artist: "Nicholas Britell",
            album: "Succession□ Season 1 (HBO Original Series Soundtrack)",
            track: "Succession (Main Title Theme)",
            prevTimestamp: null,
            prevProgressMs: null,
        }
        this.canvasClicked = this.canvasClicked.bind(this);
	}

    canvasClicked(event) {
        const x = event.offsetX;
        const y = event.offsetY;

        const measureWidth = 100;
        const measureHeight = 30;
        const padding = 10;

        const measureX = Math.floor(x / (measureWidth + padding));
        const measureY = Math.floor(y / (measureHeight + padding));
        const measureIndex = measureY * 4 + measureX;

        this.props.player.seekToMeasure(measureIndex);
    }

	componentDidMount() {
        const canvas = this.canvasRef.current
        canvas.width = 440;
        canvas.height = 1400;
        canvas.addEventListener('click', this.canvasClicked, false);

        const selfClass = this;
        setInterval(function() {
            selfClass.props.player.refreshCurrentTrack().then((blank) => {
                const player = selfClass.props.player;
                clearInterval(selfClass.drawInterval);
                selfClass.drawInterval = setInterval(() => {
                    selfClass.drawCanvas(player.songStructure, player.getProgress());
                }, 100);
            })
        }, 1000);
	}

    drawCanvas(beats, currentTime) {
        var totalMeasures = beats[beats.length-1].measureNumber;

		const canvas = this.canvasRef.current

        const measuresPerRow = 4;
        const rows = Math.ceil(totalMeasures / measuresPerRow);

        const measureWidth = 100;
        const measureHeight = 30;
        const padding = 10;

        let ctx = canvas.getContext('2d');

        var currentMeasure = 0;
        for (const index in beats) {
            const beat = beats[index];
            if (beat.timestamp < currentTime) {
                currentMeasure = beat.measureNumber;
            }
        }

        for (var i=0; i<measuresPerRow; i++) {
            for (var j=0; j<rows; j++) {
                const measureNumber = i + j*measuresPerRow;
                if (measureNumber < totalMeasures) {
                    const x = i*(measureWidth+padding);
                    const y = j*(measureHeight+padding);
                    var chords = "";
                    for (const index in beats) {
                        const beat = beats[index];
                        if (beat.measureNumber === measureNumber) {
                            if (beat.chord !== undefined) {
                                chords = chords + " " + beat.chord;
                            }
                        }
                    }
                    const measureColor = currentMeasure < measureNumber ? 'yellow' : 'red';
                    ctx.fillStyle = measureColor;
                    ctx.fillRect(x, y, measureWidth, measureHeight);
                    ctx.fillStyle = '#000000';
                    ctx.font = "20px Impact";
                    ctx.fillText(chords, x, y + 20 );
                }
            }
        }
    }

	render() {
		return (
        <div>
            <canvas ref={this.canvasRef}></canvas>
        </div>
		);
	}
}
