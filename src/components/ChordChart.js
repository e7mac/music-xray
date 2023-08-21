import React, { useEffect, useState } from 'react';

const ChordChart = ({ player }) => {
    const [songStructure, setSongStructure] = useState([]);
    const [beatsPerRow, setBeatsPerRow] = useState(16);

    useEffect(() => {
        player.songStructure().then(beats => {
            setSongStructure(beats);
            console.log(beats);
        });

        const drawInterval = setInterval(() => {
            setSongStructure(prevSongStructure => {
                const currentTime = player.getCurrentTime();
                const currentMeasure = getCurrentMeasure(prevSongStructure, currentTime);
                const measuresPerRow = 4;
                // console.log("bpm", getBeatsPerMeasure(prevSongStructure))
                setBeatsPerRow(measuresPerRow * getBeatsPerMeasure(prevSongStructure));
                return prevSongStructure.map((beat, index) => {
                    const prevBeat = prevSongStructure[index - 1];
                    const shouldDisplayChord = beat.chord !== prevBeat?.chord; // Check if chord is different from previous beat
                    return { ...beat, currentMeasure, shouldDisplayChord };
                });
            });
        }, 100);

        return () => {
            clearInterval(drawInterval);
        };
    }, [player]);

    const seekToTime = (time) => {
        player.seekToTime(time);
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

    const getBeatsPerMeasure = (beats) => {
        let prevBeatNumber = -1;
        for (const beat of beats) {
            if (beat.measureNumber == 2) {
                return prevBeatNumber;
            }
            prevBeatNumber = beat.beatNumber;
        }
        return 4; // default
    };

    return (
        <div className="quiz-chart">
            {Array.from({ length: Math.ceil(songStructure.length / beatsPerRow) }).map((_, rowIndex) => (
                <div className="row" key={rowIndex}>
                    {songStructure.slice(rowIndex * beatsPerRow, (rowIndex + 1) * beatsPerRow).map((beat, index) => (
                        <div
                            onClick={() => seekToTime(beat.timestamp)}
                            key={index}
                            measure={beat.measureNumber}
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
