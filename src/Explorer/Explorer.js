import { createContext, useEffect, useState } from "react"
import { API_query_vortices } from "../API";
import Sidebar from "./Siderbar";
import FilteredVortices from "./FilteredVortices";
import { LoadingPage } from "../LoadingPage";
import PlotResults from "./PlotResults";
import Switch from "../Inputs/Switch";

const ResultType = Object.freeze({
    DATA_ONLY: { name: "data" },
    PLOT_ONLY: { name: "plot" },
});

export const VortexData = createContext(null);
export const FilteredVortexData = createContext(null);

export default function Explorer({ }) {
    const [vortex_data, setVortexData] = useState([]);
    const [filtered_vortex_data, setFilteredVortexData] = useState([]);
    const [loading_enabled, setLoading] = useState(true);

    useEffect(() => {
        API_query_vortices("_size=max").then((data) => (setVortexData(data.rows)));
    }, []);

    useEffect(() => {
        if (vortex_data.length > 0) {
            setLoading(false);
        }
    }, [vortex_data]);

    return (
        <div className="container m-0 grid grid-cols-5 gap-2">
            <LoadingPage enabled={loading_enabled} text="Loading" />
            <FilteredVortexData.Provider value={{ filtered_vortex_data: filtered_vortex_data, setFilteredVortexData: setFilteredVortexData }}>
                <VortexData.Provider value={{ vortex_data: vortex_data, setVortexData: setVortexData }}>
                    <Sidebar />
                </VortexData.Provider>
                <ExplorerResults />
            </FilteredVortexData.Provider>
        </div >
    )
}


const ExplorerResults = () => {
    const [result_type, setResultType] = useState(ResultType.DATA_ONLY);

    return (
        <div className="p-2 col-span-4">
            <div>
                <Switch name="result_type" options={Object.entries(ResultType)} onChange={(e) => setResultType(ResultType[e])} selected={result_type}/>
            </div>
            <div className="w-full p-2">
                { result_type == ResultType.DATA_ONLY ?
                    <FilteredVortices /> :
                    <PlotResults />
                }
            </div>
        </div>
    )
}