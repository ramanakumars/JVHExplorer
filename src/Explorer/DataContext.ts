import { createContext } from "react";
import { VortexDataType } from "../API/types";

export interface VortexExtendedDataType extends VortexDataType {
    size: number;
    aspect_ratio: number;
}

export interface VortexDataContextType {
    vortex_data: VortexExtendedDataType[];
    setVortexData: (data: any) => void;
}

export interface FilteredVortexDataContextType {
    filtered_vortex_data: VortexExtendedDataType[];
    setFilteredVortexData: (data: any) => void;
}

export const VortexData = createContext<VortexDataContextType>({
    vortex_data: [],
    setVortexData: () => null,
});
export const FilteredVortexData = createContext<FilteredVortexDataContextType>({
    filtered_vortex_data: [],
    setFilteredVortexData: () => null,
});
