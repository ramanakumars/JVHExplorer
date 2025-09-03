import React, { useState, useEffect } from "react";
import { parseValue } from "./parseValue";

interface SliderProps {
    minValue: number;
    maxValue: number;
    value: number;
    type: string;
    text: string;
    name: string;
    onChange: (value: number) => void;
}

export function Slider({
    minValue,
    maxValue,
    value,
    text,
    name,
    type,
    onChange,
}: SliderProps) {
    const [_value, setValue] = useState(value);

    var step = 1;
    if (type.includes("float")) {
        step = 0.01;
    }

    useEffect(() => {
        onChange(_value);
    }, [_value, onChange]);

    return (
        <span className="container py-2 mx-auto grid gap-1 grid-cols-8">
            <label
                htmlFor={name}
                className="col-span-3 p-1 text-right italic font-bold"
            >
                {text}:
            </label>
            <input
                type="range"
                name={name}
                onChange={(e) =>
                    setValue(parseValue(e.target.value, type, minValue))
                }
                value={_value}
                min={minValue}
                max={maxValue}
                step={step}
                className={"text-right min-w-5 col-span-5"}
            />
        </span>
    );
}

