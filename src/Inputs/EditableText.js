import { parseValue } from "./parseValue";
import { useState, useEffect } from "react";
import "../css/index.css"

export default function EditableText({ value, type, onChange }) {
	const [isEditing, setEditing] = useState(false);
	const [val, setValue] = useState(value);

	useEffect(() => {
		setValue(value);
	}, [value]);

	const handleChange = () => {
		setEditing(false);
		var _value = parseValue(val, type, 0);
		setValue(_value);
		onChange(_value);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleChange();
		}
	};

	return (
		<div className='editable-text'>
			{isEditing ? (
				<input
					autoFocus
					type='text'
					value={val}
					onKeyDown={handleKeyPress}
					onChange={(e) => setValue(e.target.value)}
					onBlur={handleChange}
				/>
			) : (
				<span className='editable-text' onClick={() => setEditing(true)}>
					{parseValue(val, type, 0)}
				</span>
			)}
		</div>
	)
}