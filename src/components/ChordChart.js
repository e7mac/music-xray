import React, { useRef, useEffect } from 'react';

const ChordChart = ({ player }) => {
    const canvasRef = useRef(null);

    const canvasClicked = (event) => {
        const x = event.offsetX;
        const y = event.offsetY;

        const measureWidth = 100;
        const measureHeight = 30;
        const padding = 10;

        const measureX = Math.floor(x / (measureWidth + padding));
        const measureY = Math.floor(y / (measureHeight + padding));
        const measureIndex = measureY * 4 + measureX + 1; // 1-index

        player.seekToMeasure(measureIndex);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 440;
        canvas.height = 1400;
        canvas.addEventListener('click', canvasClicked, false);

        let drawInterval;

        player.refreshCurrentTrack().then(() => {
            drawInterval = setInterval(() => {
                drawCanvas(player.songStructure, player.getCurrentTime());
            }, 100);
        });

        return () => {
            clearInterval(drawInterval);
            canvas.removeEventListener('click', canvasClicked, false);
        };
    }, [player]);

    const drawCanvas = (beats, currentTime) => {
        const totalMeasures = beats[beats.length - 1].measureNumber;

        const canvas = canvasRef.current;

        const measuresPerRow = 4;
        const rows = Math.ceil(totalMeasures / measuresPerRow);

        const measureWidth = 100;
        const measureHeight = 30;
        const padding = 10;

        const ctx = canvas.getContext('2d');

        let currentMeasure = 0;
        for (const beat of beats) {
            if (beat.timestamp < currentTime) {
                currentMeasure = beat.measureNumber;
            }
        }

        for (let i = 0; i < measuresPerRow; i++) {
            for (let j = 0; j < rows; j++) {
                const measureNumber = i + j * measuresPerRow + 1; // index-from-1
                if (measureNumber < totalMeasures) {
                    const x = i * (measureWidth + padding);
                    const y = j * (measureHeight + padding);
                    let chords = '';
                    for (const beat of beats) {
                        if (beat.measureNumber === measureNumber && beat.chord !== undefined) {
                            chords = chords + ' ' + beat.chord;
                        }
                    }
                    const measureColor = measureNumber === currentMeasure ? 'red' : measureNumber < currentMeasure ? 'orange' : 'yellow';
                    ctx.fillStyle = measureColor;
                    ctx.fillRect(x, y, measureWidth, measureHeight);
                    ctx.fillStyle = '#000000';
                    ctx.font = '20px Impact';
                    ctx.fillText(chords, x, y + 20);
                }
            }
        }
    };

    return (
        <div>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ChordChart;
