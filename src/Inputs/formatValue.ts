export const formatValue = (value: number, type: string) => {
    if (type.includes("float")) {
        return value.toFixed(2);
    } else {
        return String(value);
    }
};
