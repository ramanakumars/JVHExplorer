import React from "react";
import { parseValue } from "./parseValue";
import { useState, useEffect } from "react";
import "../css/index.css";
import { formatValue } from "./formatValue";

interface EditableTextProps {
    value: string;
    type: string;
    onChange: (event: any) => void;
}

export default function EditableText({
    value,
    type,
    onChange,
}: EditableTextProps) {
    const [isEditing, setEditing] = useState(false);
    const [val, setValue] = useState<string>(value);

    useEffect(() => {
        setValue(value);
    }, [value]);

    const handleChange = () => {
        setEditing(false);
        var _value = parseValue(val, type, 0);
        setValue(formatValue(_value, type));
        onChange(_value);
    };

    const handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            handleChange();
        }
    };

    return (
        <div className="editable-text">
            {isEditing ? (
                <input
                    autoFocus
                    type="text"
                    value={val}
                    onKeyDown={handleKeyPress}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleChange}
                />
            ) : (
                <span
                    className="editable-text"
                    onClick={() => setEditing(true)}
                >
                    {parseValue(val, type, 0)}
                </span>
            )}
        </div>
    );
}

