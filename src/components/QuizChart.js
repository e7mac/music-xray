import React, { useEffect, useState } from 'react';

const QuizChart = ({ player }) => {
    const [songStructure, setSongStructure] = useState([]);
    const [quizRowIndex, setQuizRowIndex] = useState(-1);
    const [showChordDisplay, setShowChordDisplay] = useState(false);

    const toggleChordDisplay = () => {
        setShowChordDisplay(!showChordDisplay);
    };

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
            setSongStructure(beats);
        });

        const drawInterval = setInterval(() => {
            setSongStructure(prevSongStructure => {
                const currentTime = player.getCurrentTime();
                const currentMeasure = getCurrentMeasure(prevSongStructure, currentTime);
                // console.log(currentTime, currentMeasure);
                return prevSongStructure.map((beat, index) => {
                    const prevBeat = prevSongStructure[index - 1];
                    const shouldDisplayChord = (beat.chord !== prevBeat?.chord) || (index%16 === 0);
                    return { ...beat, currentMeasure, shouldDisplayChord };
                });
            });
        }, 100);

        return () => {
            clearInterval(drawInterval);
        };
    }, [player]);

    const rows = Math.ceil(songStructure.length / 16);

    useEffect(() => {
        if (songStructure.length > 0 && quizRowIndex === -1) {
            const randomRow = Math.floor(Math.random() * rows);
            setQuizRowIndex(randomRow);
            const firstBeatOfRow = songStructure[randomRow*16];
            const lastBeatOfRow = songStructure[randomRow*16 + 16 - 1];
            player.setLoopTime(firstBeatOfRow.timestamp, lastBeatOfRow.timestamp)
        }
    }, [songStructure, quizRowIndex, player, rows]);

    const visibleRows = 3; // Number of rows to show around the quiz row

    const startRowIndex = Math.max(0, quizRowIndex - 1);
    // const endRowIndex = Math.min(rows - 1, quizRowIndex + 1);

    return (
        <div className="quiz-chart">
            <button onClick={toggleChordDisplay}>
                {showChordDisplay ? 'Hide Chord Names' : 'Show Chord Names'}
            </button>            
            {Array.from({ length: visibleRows }).map((_, rowIndex) => {
                const currentRowIndex = startRowIndex + rowIndex;
                return (
                    <div className="row" key={currentRowIndex}>
                        {songStructure.slice(currentRowIndex * 16, (currentRowIndex + 1) * 16).map((beat, index) => (
                            <div
                                onClick={() => beatClicked(currentRowIndex * 16 + index)}
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
                                {beat.shouldDisplayChord ? (currentRowIndex !== quizRowIndex || showChordDisplay ? beat.chord : "??") : '.'}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default QuizChart;