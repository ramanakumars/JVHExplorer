export const setMinMax = (data: number[]) => {
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    return {
        minValue: minValue,
        maxValue: maxValue,
        currentMin: minValue,
        currentMax: maxValue,
    };
};

export const compareMinMax = (
    val: number,
    range: { currentMin: number; currentMax: number },
) => val >= range.currentMin && val <= range.currentMax;
