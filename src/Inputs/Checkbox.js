import { useState, useEffect } from "react";

export function Checkbox({ value, text, name, onChange }) {
	return (
		<span className="container py-2 mx-auto grid gap-1 grid-cols-8 items-center min-h-6">
			<label htmlFor={name} className='col-span-5 p-1 text-right italic font-bold'>
				{text}:
			</label>
			<input type='checkbox'
				name={name}
				onChange={onChange}
				defaultChecked={value}
				className={'text-right w-5 h-5 col-span-3'}
			/>
		</span>
	)
}