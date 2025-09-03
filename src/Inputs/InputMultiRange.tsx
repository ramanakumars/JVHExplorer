import React, { useState, useEffect } from "react";
import { parseValue } from "./parseValue";
import EditableText from "./EditableText";
import MultiRangeSlider from "multi-range-slider-react";
import "../css/index.css";
import { formatValue } from "./formatValue";

interface MultiRangeProps {
    minValue: number;
    maxValue: number;
    step: number;
    type: string;
    text: string;
    onChange: (minValue: number, maxValue: number) => void;
    defaultMin: number;
    defaultMax: number;
}

export function InputMultiRange({
    minValue,
    maxValue,
    step,
    type,
    text,
    onChange,
    defaultMin,
    defaultMax,
}: MultiRangeProps) {
    const [_minValue, setMinValue] = useState(
        parseValue(defaultMin, type, minValue),
    );
    const [_maxValue, setMaxValue] = useState(
        parseValue(defaultMax, type, minValue),
    );
    const absMin = parseValue(minValue, type, 0);
    const absMax = parseValue(maxValue, type, 0);

    const validateMin = (value: number) => {
        if (!isNaN(value)) {
            return Math.max(value, absMin);
        } else {
            return NaN;
        }
    };

    const validateMax = (value: number) => {
        if (!isNaN(value)) {
            return Math.min(value, absMax);
        } else {
            return NaN;
        }
    };

    useEffect(() => {
        setMaxValue(validateMax(defaultMax));
        setMinValue(validateMin(defaultMin));
    }, [defaultMin, defaultMax, absMin, absMax]);

    useEffect(() => {
        onChange(_minValue, _maxValue);
    }, [_minValue, _maxValue]);

    return (
        <div className="w-full flex flex-wrap justify-between box-border">
            <label className="font-bold">{text}: </label>
            <MultiRangeSlider
                min={absMin}
                max={absMax}
                step={step}
                ruler={false}
                label={false}
                preventWheel={false}
                minValue={_minValue}
                maxValue={_maxValue}
                onInput={(e) => {
                    setMinValue(validateMin(e.minValue));
                    setMaxValue(validateMax(e.maxValue));
                }}
            />

            <div className="w-full flex flex-nowrap justify-between box-border">
                <span className="slider-min">
                    <EditableText
                        value={formatValue(_minValue, type)}
                        type={type}
                        onChange={(value) => setMinValue(validateMin(value))}
                    />
                </span>
                <span className="slider-min">
                    <EditableText
                        value={formatValue(_maxValue, type)}
                        type={type}
                        onChange={(value) => setMaxValue(validateMax(value))}
                    />
                </span>
            </div>
        </div>
    );
}
