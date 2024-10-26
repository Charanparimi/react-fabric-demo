import { useEffect, useState } from "react";

function SettingsTool ({canvas}) {
    const [selectedObject, setSelectedObject] = useState(null);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [diameter, setDiameter] = useState("");
    const [color, setColor] = useState("");

    useEffect( ()=> {
        if(canvas)
        {
            canvas.on("selection:created", (event) => {
                handleObjectSelection(event.selected[0]);
            });

            canvas.on("selection:updated", (event) => {
                handleObjectSelection(event.selected[0]);
            })

            canvas.on("selection:cleared", (event) => {
                setSelectedObject(null);
                clearSettings();
            })

            canvas.on("object:modified", (event) => {
                handleObjectSelection(event.target);
            })

            canvas.on("object:scaling", (event) => {
                handleObjectSelection(event.target);
            })
        }
    },[canvas])

    const handleObjectSelection = (object) => {
        if(!object) return;

        setSelectedObject(object);

        if(object.type === "rect")
        {
            setWidth(Math.round(object.width * object.scalex));
            setHeight(Math.round(object.height * object.scaleY));
            setColor(object.fill);
            setDiameter("");
        } else if(object.type === "circle") {
            setWidth("");
            setHeight("");
            setColor(object.fill);
            setDiameter(Math.round(object.radius * 2 * object.scalex));
        }
    }

    const clearSettings = () => {
        setWidth("");
        setHeight("");
        setColor("");
        setDiameter("");
    }

    const handleWidthChange =(e) => {};
    const handleHeightChange =(e) => {};
    const handleDiameterChange =(e) => {};
    const handleColorChange =(e) => {};

 return (
    <div className="Settings darkmode">
        {selectedObject && selectedObject.type === "rect" && (
            <>
                <input label="Width" value={width} onChange={handleWidthChange} />
                <input label="Height" value={height} onChange={handleHeightChange} />
                <input label="Diametor" value={diameter} onChange={handleDiameterChange} />
                <input label="Color" value={color} onChange={handleColorChange} />
            </>
        )}
    </div>
 );
}

export default SettingsTool;