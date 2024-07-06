export const parseValue = (value, type, default_value) => {
	if (type.includes('float')) {
		value = Number.parseFloat(value).toFixed(2);
	} else if (type.includes('int')) {
		value = parseInt(value);
	} else {
		value = default_value;
	}

	if (isNaN(value)) {
		value = default_value;
	}

	return value;
}
