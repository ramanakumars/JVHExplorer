export const setMinMax = (data) => {
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    return {
        minValue: minValue, maxValue: maxValue, currentMin: minValue, currentMax: maxValue
    }
}

export const compareMinMax = (val, range) => (
    ((val >= range.currentMin) && (val <= range.currentMax))
)

