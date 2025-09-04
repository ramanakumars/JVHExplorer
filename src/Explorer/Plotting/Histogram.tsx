import React, { useState, useContext, useEffect, useMemo } from "react";
import { FilteredVortexData, VortexExtendedDataType } from "../DataContext";
import { PlotStyleContext } from "./PlotStyle";
import Select from "../../Inputs/Select";
import { Slider } from "../../Inputs/Slider";
import plottable_variables from "./PlottableVariables";
import Plot from "react-plotly.js";
import { PlotVariableType } from "./PlotComponent";
import { PlotData } from "plotly.js";

interface HistogramDataType extends Partial<PlotData> {
    x: number[];
    nbinsx?: number;
}

export const Histogram = ({
    plot_variables,
}: {
    plot_variables: PlotVariableType;
}) => {
    const { filtered_vortex_data } = useContext(FilteredVortexData);
    const { PlotStyle } = useContext(PlotStyleContext);

    const data: HistogramDataType[] = useMemo(() => {
        if (!plot_variables.x) return [];

        return [
            {
                x: filtered_vortex_data.map(
                    (dati) =>
                        Number(
                            dati[
                                plot_variables.x as keyof VortexExtendedDataType
                            ],
                        ) *
                        plottable_variables[
                            plot_variables.x as keyof typeof plottable_variables
                        ].scale,
                ),
                type: "histogram",
                nbinsx: PlotStyle.histogram?.numBins,
            },
        ];
    }, [plot_variables, filtered_vortex_data, PlotStyle.histogram]);

    if (data.length > 0) {
        return (
            <Plot
                data={data}
                layout={{
                    xaxis: {
                        title: {
                            text: plottable_variables[
                                plot_variables.x as keyof typeof plottable_variables
                            ].name,
                        },
                    },
                    yaxis: {
                        title: { text: "Count" },
                        type: PlotStyle.histogram?.yscale,
                    },
                    font: {
                        family: "Material, Arial",
                    },
                    margin: {
                        l: 50,
                        r: 20,
                        b: 50,
                        t: 20,
                        pad: 4,
                    },
                }}
                config={{
                    responsive: true,
                }}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                useResizeHandler={true}
            />
        );
    }
};

export const HistogramPlotStyle = () => {
    const [yscale, setYScale] = useState("linear");
    const [numBins, setNumBins] = useState(20);
    const { PlotStyle, setPlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        setPlotStyle({
            ...PlotStyle,
            histogram: {
                yscale: yscale as "linear" | "log",
                numBins: Number(numBins),
            },
        });
    }, [yscale, numBins]);

    return (
        <div className="w-full p-2 flex flex-col justify-start items-stretch">
            <Select
                id={"yscale"}
                var_name={"y-axis scale"}
                variables={[
                    { id: "linear", name: "Linear" },
                    { id: "log", name: "Log" },
                ]}
                value={yscale}
                onChange={setYScale}
            />
            <Slider
                minValue={5}
                maxValue={150}
                name={"num_bins"}
                text={"Number of bins"}
                type={"int"}
                onChange={setNumBins}
                value={numBins}
            />
        </div>
    );
};
