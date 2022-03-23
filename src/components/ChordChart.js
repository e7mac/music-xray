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
        }
	}

	componentDidMount() {
        const canvas = this.canvasRef.current
        canvas.width = 440;
        canvas.height = 1400;

        const selfClass = this;
        setInterval(function() {
            selfClass.getLatestData();
        }, 500);
	}

    getLatestData() {
        this.props.spotify.getMyCurrentPlayingTrack().then((data) => {
            const artist = data.item.artists[0].name;
            const album = data.item.album.name.replace(":","□");
            const track = data.item.name;
            const currentTime = data.progress_ms / 1000;
            this.props.api.getChords(track,artist,album).then((chords) => {
                this.props.api.getBeats(track,artist,album).then((beats) => {

                    var songStructure = [];
                    var measureNumber = 0;
                    for (const i in beats) {
                        const beat = beats[i];
                        if (beat[1] === 1) {
                            measureNumber += 1;
                        }
                        songStructure.push({
                            timestamp: beat[0],
                            beatNumber: beat[1],
                            measureNumber: measureNumber,
                        });
                    }

                    for (var i=0; i<chords.length ;i++) {
                        const chord = chords[i];
                        for (var j=0; j<songStructure.length - 1 ;j++) {
                            const beat = songStructure[j];
                            const nextBeat = songStructure[j+1];
                            if (chord.timestamp >= beat.timestamp
                            && chord.timestamp < nextBeat.timestamp) {
                                // beat.chords.push(chord.chord);
                                beat.chord = chord.chord;
                            }
                        }
                    }
                    this.drawCanvas(songStructure, currentTime);
                })
            })
        })
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

	componentDidUpdate() {
	}

	render() {
		return (
        <div>
            <canvas ref={this.canvasRef}></canvas>
        </div>
		);
	}
}
