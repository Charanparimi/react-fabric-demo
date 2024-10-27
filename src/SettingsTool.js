import { Input } from 'blocksin-system';
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
            setWidth(Math.round(object.width * object.scaleX));
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

    const handleWidthChange =(e) => {
        const value = e.target.value.replace(/,/g,"");
        const intValue = parseInt(value, 10);

        setWidth(intValue);

        if(selectedObject && selectedObject.type === "rect" && intValue >= 0)
        {
            selectedObject.set({ width: intValue / selectedObject.scaleX});
            canvas.renderAll();
        }
    };
    const handleHeightChange =(e) => {
        const value = e.target.value.replace(/,/g,"");
        const intValue = parseInt(value, 10);

        setHeight(intValue);

        if(selectedObject && selectedObject.type === "rect" && intValue >= 0)
        {
            selectedObject.set({ height: intValue / selectedObject.scaleY});
            canvas.renderAll();
        }
    };
    const handleDiameterChange =(e) => {
        const value = e.target.value.replace(/,/g,"");
        const intValue = parseInt(value, 10);

        setDiameter(intValue);

        if(selectedObject && selectedObject.type === "rect" && intValue >= 0)
        {
            selectedObject.set({ radius: intValue / 2 / selectedObject.scaleX});
            canvas.renderAll();
        }
    };
    const handleColorChange =(e) => {
        const value = e.target.value;

        setColor(value);

        if(selectedObject)
        {
            selectedObject.set({ fill: value});
            canvas.renderAll();
        }
    };

 return (
    <div className="Settings darkmode">
        {selectedObject && selectedObject.type === "rect" && (
            <>
                <Input fluid label="Width" value={width} onChange={handleWidthChange} />
                <Input fluid label="Height" value={height} onChange={handleHeightChange} />
                {/* <Input fluid label="Diametor" value={diameter} onChange={handleDiameterChange} /> */}
                <Input fluid label="Color" value={color} onChange={handleColorChange} />
            </>
        )}
    </div>
 );
}

export default SettingsTool;