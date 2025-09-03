export const parseValue = (
    value: number | string,
    type: string,
    default_value: number,
) => {
    let _value: number;
    if (type.includes("float")) {
        _value = Number(value); //.toFixed(2);
    } else if (type.includes("int")) {
        _value = parseInt(String(value));
    } else {
        return default_value;
    }

    if (isNaN(_value)) {
        return default_value;
    }

    return _value;
};
