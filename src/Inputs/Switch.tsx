import React from "react";
import "../css/inputs.css";

interface Option {
    name: string;
}

interface SwitchProps {
    name: string;
    options: [string, Option][];
    onChange: (key: string) => void;
    selected: Option;
}

export default function Switch({
    name,
    options,
    onChange,
    selected,
}: SwitchProps) {
    return (
        <div className="react-switch-container">
            {options.map(([key, option]) => (
                <RadioButton
                    key={key}
                    id={key}
                    option={option}
                    name={name}
                    onChange={(e) => onChange(e)}
                    selected={selected}
                />
            ))}
        </div>
    );
}

interface RadioButtonProps {
    name: string;
    id: string;
    option: Option;
    onChange: (id: string) => void;
    selected: Option;
}

const RadioButton = ({
    name,
    id,
    option,
    onChange,
    selected,
}: RadioButtonProps) => {
    return (
        <div className="react-switch" onClick={() => onChange(id)}>
            <input
                type="radio"
                id={option.name}
                name={name}
                value={id}
                checked={selected.name === option.name ? true : false}
                onChange={(e) => e}
            />
            <label htmlFor={id} className="w-full h-full cursor-pointer">
                {option.name}
            </label>
        </div>
    );
};

