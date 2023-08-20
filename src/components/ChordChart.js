import React, { useEffect, useState } from 'react';

const ChordChart = ({ player }) => {
    const [canvasData, setCanvasData] = useState([]);

    const beatClicked = (index) => {
        const measureIndex = Math.floor(index / 4) + 1;
        player.seekToMeasure(measureIndex);
    };

    useEffect(() => {
        player.songStructure().then(beats => {
            setCanvasData(beats);
        });

        const drawInterval = setInterval(() => {
            setCanvasData(prevCanvasData => {
                const currentTime = player.getCurrentTime();
                const currentMeasure = getCurrentMeasure(prevCanvasData, currentTime);
                return prevCanvasData.map((beat, index) => {
                    const prevBeat = prevCanvasData[index - 1];
                    const shouldDisplayChord = beat.chord !== prevBeat?.chord; // Check if chord is different from previous beat
                    return { ...beat, currentMeasure, shouldDisplayChord };
                });
            });
        }, 100);

        return () => {
            clearInterval(drawInterval);
        };
    }, [player]);

    const getCurrentMeasure = (beats, currentTime) => {
        let currentMeasure = 0;
        for (const beat of beats) {
            if (beat.timestamp < currentTime) {
                currentMeasure = beat.measureNumber;
            }
        }
        return currentMeasure;
    };

    const rows = Math.ceil(canvasData.length / 16);

    return (
        <div className="quiz-chart">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div className="row" key={rowIndex}>
                    {canvasData.slice(rowIndex * 16, (rowIndex + 1) * 16).map((beat, index) => (
                        <div
                            onClick={() => beatClicked(rowIndex * 16 + index)}
                            key={index}
                            className="beat"
                            style={{
                                width: '80px',
                                height: '50px',
                                color: 'black',
                                fontSize: 15,
                                backgroundColor:
                                    beat.measureNumber === beat.currentMeasure
                                        ? 'red'
                                        : beat.measureNumber < beat.currentMeasure
                                        ? 'orange'
                                        : 'yellow',
                                display: 'inline-block',
                                margin: '1px',
                            }}
                        >
                            {beat.shouldDisplayChord ? beat.chord : '.'}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ChordChart;
