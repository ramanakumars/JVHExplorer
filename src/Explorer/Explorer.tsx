import React, { useContext, useEffect, useState } from "react";
import { API_query_vortices } from "../API/API";
import Sidebar from "./Siderbar";
import FilteredVortices from "./FilteredVortices";
import { LoadingPage } from "../LoadingPage";
import PlotResults from "./Plotting/PlotResults";
import Switch from "../Inputs/Switch";
import {
    FilteredVortexData,
    VortexData,
    VortexExtendedDataType,
} from "./DataContext";

const ResultType = Object.freeze({
    DATA_ONLY: { name: "data" },
    PLOT_ONLY: { name: "plot" },
});

function exportFilteredJSON(rows: VortexExtendedDataType[]) {
    const blob = new Blob(
        [
            JSON.stringify(
                rows.map(({ rowid, index, ...rest }) => rest),
                null,
                2,
            ),
        ],
        {
            type: "application/json",
        },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vortices_${rows.length}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function Explorer({}) {
    const [vortex_data, setVortexData] = useState<VortexExtendedDataType[]>([]);
    const [filtered_vortex_data, setFilteredVortexData] = useState<
        VortexExtendedDataType[]
    >([]);
    const [loading_enabled, setLoading] = useState(true);

    useEffect(() => {
        API_query_vortices("_size=max").then((data) =>
            setVortexData(
                data.rows.map((vortex) => ({
                    ...vortex,
                    aspect_ratio:
                        Math.max(
                            vortex.physical_width,
                            vortex.physical_height,
                        ) /
                        Math.min(vortex.physical_height, vortex.physical_width),
                    size: Math.max(
                        vortex.physical_width,
                        vortex.physical_height,
                    ),
                    physical_area:
                        Math.PI *
                        vortex.physical_width *
                        vortex.physical_height,
                })),
            ),
        );
    }, []);

    useEffect(() => {
        if (vortex_data.length > 0) {
            setLoading(false);
        }
    }, [vortex_data]);

    return (
        <div className="container m-0 grid grid-cols-5 gap-2">
            <LoadingPage enabled={loading_enabled} text="Loading" />
            <FilteredVortexData.Provider
                value={{
                    filtered_vortex_data: filtered_vortex_data,
                    setFilteredVortexData: setFilteredVortexData,
                }}
            >
                <VortexData.Provider
                    value={{
                        vortex_data: vortex_data,
                        setVortexData: setVortexData,
                    }}
                >
                    <Sidebar />
                    <ExplorerResults />
                </VortexData.Provider>
            </FilteredVortexData.Provider>
        </div>
    );
}

const ExplorerResults = () => {
    const [result_type, setResultType] = useState(ResultType.PLOT_ONLY);

    const { filtered_vortex_data } = useContext(FilteredVortexData);
    const { vortex_data } = useContext(VortexData);

    return (
        <div className="p-2 col-span-4 flex flex-col flex-nowrap gap-2">
            <div>
                <Switch
                    name="result_type"
                    options={Object.entries(ResultType)}
                    onChange={(e) =>
                        setResultType(ResultType[e as keyof typeof ResultType])
                    }
                    selected={result_type}
                />
            </div>
            <div className="w-full rounded-xl bg-gray-600 text-white p-4 flex flex-row flex-nowrap justify-between items-center">
                <span className="w-full">
                    Filtering {filtered_vortex_data.length} out of{" "}
                    {vortex_data.length}
                </span>
                <span>
                    <button
                        className="bg-primary-500 p-2 cursor-pointer hover:bg-gray-400 rounded-xl"
                        onClick={() => exportFilteredJSON(filtered_vortex_data)}
                    >
                        Export JSON
                    </button>
                </span>
            </div>
            <div className="w-full p-2">
                <FilteredVortices
                    visible={
                        result_type === ResultType.DATA_ONLY ? null : "hidden"
                    }
                />
                <PlotResults
                    visible={
                        result_type === ResultType.PLOT_ONLY ? null : "hidden"
                    }
                />
            </div>
        </div>
    );
};
