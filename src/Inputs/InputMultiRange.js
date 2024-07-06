import { useState, useEffect } from "react";
import { parseValue } from './parseValue';
import EditableText from './EditableText';
import MultiRangeSlider from "multi-range-slider-react";
import '../css/index.css';

export function InputMultiRange({ minValue, maxValue, step, type, text, onChange, currentMin, currentMax }) {
	const [_minValue, setMinValue] = useState(parseValue(currentMin, type, minValue));
	const [_maxValue, setMaxValue] = useState(parseValue(currentMax, type, minValue));
	const absMin = parseValue(minValue, type, 0);
	const absMax = parseValue(maxValue, type, 0);

	const validateMin = (value) => {
		if (!isNaN(value)) {
			return Math.max(value, absMin);
		} else {
			return NaN;
		}
	};

	const validateMax = (value) => {
		if (!isNaN(value)) {
			return Math.min(value, absMax);
		} else {
			return NaN;
		}
	};

	useEffect(() => {
		setMaxValue(validateMax(_maxValue));
		setMinValue(validateMin(_minValue));
	}, [minValue, maxValue, _minValue, _maxValue, absMin, absMax]);

	useEffect(() => {
		onChange(_minValue, _maxValue);
	}, [_minValue, _maxValue]);

	return (
		<div className='w-full flex flex-wrap justify-between box-border'>
			<label>{text}: </label>
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

			<div className='w-full flex flex-nowrap justify-between box-border'>
				<span className='slider-min'>
					<EditableText
						value={_minValue}
						type={type}
						onChange={(value) => setMinValue(validateMin(value))}
					/>
				</span>
				<span className='slider-min'>
					<EditableText
						value={_maxValue}
						type={type}
						onChange={(value) => setMaxValue(validateMax(value))}
					/>
				</span>
			</div>
		</div>
	)
}
