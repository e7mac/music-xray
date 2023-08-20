import React, { useEffect, useState } from 'react';

const QuizChart = ({ player }) => {
    const [canvasData, setCanvasData] = useState([]);
    const [randomRowIndex, setRandomRowIndex] = useState(-1);

    const beatClicked = (index) => {
        const measureIndex = Math.floor(index / 4) + 1;
        player.seekToMeasure(measureIndex);
    };

    const getCurrentMeasure = (beats, currentTime) => {
        let currentMeasure = 0;
        for (const beat of beats) {
            if (beat.timestamp < currentTime) {
                currentMeasure = beat.measureNumber;
            }
        }
        return currentMeasure;
    };

    useEffect(() => {
        player.songStructure().then(beats => {
            setCanvasData(beats);
        });

        const drawInterval = setInterval(() => {
            setCanvasData(prevCanvasData => {
                const currentTime = player.getCurrentTime();
                const currentMeasure = getCurrentMeasure(prevCanvasData, currentTime);
                // console.log(currentTime, currentMeasure);
                return prevCanvasData.map((beat, index) => {
                    const prevBeat = prevCanvasData[index - 1];
                    const shouldDisplayChord = (beat.chord !== prevBeat?.chord) || (index%16 == 0);
                    return { ...beat, currentMeasure, shouldDisplayChord };
                });
            });
        }, 100);

        return () => {
            clearInterval(drawInterval);
        };
    }, [player]);

    useEffect(() => {
        if (canvasData.length > 0 && randomRowIndex === -1) {
            const randomRow = 2;//Math.floor(Math.random() * rows);
            setRandomRowIndex(randomRow);
            const firstBeatOfRow = canvasData[randomRow*16];
            const lastBeatOfRow = canvasData[randomRow*16 + 16 - 1];
            player.setLoopTime(firstBeatOfRow.timestamp, lastBeatOfRow.timestamp)
        }
    }, [canvasData, randomRowIndex]);

    const rows = Math.ceil(canvasData.length / 16);

    return (
        <div className="quiz-chart">
            <div className="row" key={randomRowIndex}>
                {canvasData.slice(randomRowIndex * 16, (randomRowIndex + 1) * 16).map((beat, index) => (
                    <div
                        onClick={() => beatClicked(randomRowIndex * 16 + index)}
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
        </div>
    );
};

export default QuizChart;
