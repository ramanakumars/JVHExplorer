export interface Variable {
    id: string;
    name: string;
    minValue: number;
    maxValue: number;
    dtype: string;
    currentMin: number;
    currentMax: number;
}
