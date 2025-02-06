import { useState, useEffect } from "react";

export default function Select({ id, var_name, variables, onChange, value }) {
	const [_value, setValue] = useState(value);

	useEffect(() => {
		setValue(value);
	}, [value]);

	useEffect(() => {
		onChange(_value)
	}, [_value]);

	return (
		<span className="container py-2 mx-auto grid gap-1 grid-cols-8">
			<label htmlFor={id} key={id + "_label"} className='col-span-2 p-1 text-right italic font-bold'>
				{var_name + ": "}
			</label>
			<select
				name={var_name}
				id={id}
				defaultValue={_value}
				className="col-span-6 p-1 text-black"
				key={var_name + "_select"}
				onChange={(event) => setValue(event.target.value)}
			>
				<option value="" disabled key={var_name + "_default"}>
					Choose a variable
				</option>
				{variables.map((vi) => (
					<option
						value={vi.id}
						key={var_name + "_" + vi.name + "_label"}
					>
						{vi.name}
					</option>
				))}
			</select>
		</span>
	);
}