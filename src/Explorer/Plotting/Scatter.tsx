import React, { useMemo } from "react";
import { Slider } from "../../Inputs/Slider";
import VortexPopup from "../../Vortex/VortexPopup";
import { useState, useEffect, useContext } from "react";
import { FilteredVortexData } from "../DataContext";
import plottable_variables from "./PlottableVariables";
import { PlotStyleContext } from "./PlotStyle";
import Select from "../../Inputs/Select";
import Plot from "react-plotly.js";
import { RxCross2 } from "react-icons/rx";
import { PlotVariableType } from "./PlotComponent";
import { VortexExtendedDataType } from "../DataContext";
import { PlotData } from "plotly.js";

interface ScatterPlotDataType extends Partial<PlotData> {
    id: string;
    x: number[];
    y: number[];
}

interface TooltipProps {
    x: number;
    y: number;
    content: React.ReactNode;
}

export const Scatter = ({
    plot_variables,
}: {
    plot_variables: PlotVariableType;
}) => {
    const [tooltip, setTooltip] = useState<TooltipProps | null>(null);
    const { filtered_vortex_data } = useContext(FilteredVortexData);
    const { PlotStyle } = useContext(PlotStyleContext);

    const data: ScatterPlotDataType[] = useMemo(() => {
        if (!plot_variables.x) return [];
        if (!plot_variables.y) return [];

        const xx = plot_variables.x;
        const yy = plot_variables.y;
        return [
            {
                id: plottable_variables[plot_variables.y].name,
                x: filtered_vortex_data.map(
                    (dati) =>
                        Number(dati[xx as keyof VortexExtendedDataType]) *
                        plottable_variables[xx].scale,
                ),
                y: filtered_vortex_data.map(
                    (dati) =>
                        Number(dati[yy as keyof VortexExtendedDataType]) *
                        plottable_variables[yy].scale,
                ),
                type: "scattergl",
                mode: "markers",
                marker: { size: Number(PlotStyle.scatter?.size) },
                opacity: Number(PlotStyle.scatter?.opacity),
            },
        ];
    }, [plot_variables, filtered_vortex_data, PlotStyle.scatter]);

    const getTooltip = (index: number) => (
        <VortexPopup vortex={filtered_vortex_data[index]} link_enabled={true} />
    );

    const handleClick = (data: any) => {
        setTooltip({
            x: data.event.clientX,
            y: data.event.clientY,
            content: getTooltip(data.points[0].pointNumber),
        });
    };

    if (data.length > 0) {
        return (
            <>
                <Plot
                    data={data}
                    layout={{
                        hovermode: "closest",
                        autosize: true,
                        xaxis: {
                            title: {
                                text: plottable_variables[
                                    plot_variables.x as keyof typeof plottable_variables
                                ].name,
                            },
                            type: PlotStyle.scatter?.xscale,
                        },
                        yaxis: {
                            title: {
                                text: plottable_variables[
                                    plot_variables.y as keyof typeof plottable_variables
                                ].name,
                            },
                            type: PlotStyle.scatter?.yscale,
                        },
                    }}
                    onClick={handleClick}
                />
                {tooltip && (
                    <div
                        className="p-2 rounded-xl border-2 border-primary-900 bg-white text-sm absolute flex flex-col"
                        style={{
                            top: tooltip?.y,
                            left: tooltip?.x,
                        }}
                    >
                        <div className="w-full p-2 flex flex-row justify-end">
                            <button
                                onClick={() => setTooltip(null)}
                                className="card-button"
                            >
                                <RxCross2 className="w-full h-4" />
                            </button>
                        </div>
                        {tooltip.content}
                    </div>
                )}
            </>
        );
    }
};

export const ScatterPlotStyle = () => {
    const [marker_size, setMarkerSize] = useState(5);
    const [opacity, setOpacity] = useState(1);
    const [xscale, setXScale] = useState("linear");
    const [yscale, setYScale] = useState("linear");
    const { PlotStyle, setPlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        if (marker_size) {
            setPlotStyle({
                ...PlotStyle,
                scatter: {
                    size: marker_size,
                    xscale: xscale as "linear" | "log",
                    yscale: yscale as "linear" | "log",
                    opacity: opacity,
                },
            });
        }
    }, [marker_size, xscale, yscale, opacity]);

    return (
        <div className="w-full p-2 flex flex-col justify-start items-stretch">
            <Slider
                minValue={1}
                maxValue={15}
                value={marker_size}
                text={"Marker size"}
                type={"int"}
                name={"marker_size"}
                onChange={setMarkerSize}
            />
            <Slider
                minValue={0}
                maxValue={1}
                value={opacity}
                text={"Marker opacity"}
                type={"float"}
                name={"marker_opacity"}
                onChange={setOpacity}
            />
            <Select
                id={"xscale"}
                var_name={"x-axis scale"}
                variables={[
                    { id: "linear", name: "Linear" },
                    { id: "log", name: "Log" },
                ]}
                value={xscale}
                onChange={setXScale}
            />
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
        </div>
    );
};
