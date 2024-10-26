import * as fabric from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import SettingsTool from './SettingsTool';

const Canvas = () => {
    const canvsRef = useRef(null);
    const [canvas, setCanvas] = useState(null);

    const addRectangle = () => {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "red",
            width: 200,
            height: 200
        });

        canvas.add(rect);
    }

    const addCircle = () => {
        const circle = new fabric.Circle({
            left: 300,
            top: 100,
            fill: "yellow",
            radius: 50
        });

        canvas.add(circle);
    }

    const addLine = () => {
        const line = new fabric.Line([50, 50, 200, 200],
            {
                stroke: 'green',
                strokeWidth: 5
            })

        canvas.add(line);
    }

    useEffect(() => {
        const canvasInstance = new fabric.Canvas(canvsRef.current);

        // canvasInstance.backgroundColor = 'lightblue';
        // canvasInstance.renderAll();
        setCanvas(canvasInstance);

        return () => {
            canvasInstance.dispose();
        };
    }, []);



    return (
        <>
        <button class="btn" onClick={addLine} style={{padding:"12px 16px"}}><i class="fa-brands fa-line"></i>Line</button>
        <button class="btn" onClick={addCircle}><i class="fa fa-circle"></i>Circle</button>
        <button class="btn" onClick={addRectangle}><i class="fa-solid fa-rectangle"></i>Rectangle</button>
        <canvas ref={canvsRef} width={600} height={400} />
        <SettingsTool canvas={canvas} />        
        </>
    )
};

export default Canvas;