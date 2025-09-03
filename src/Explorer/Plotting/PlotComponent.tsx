import React, { useState, useEffect, useContext } from "react";
import { FilteredVortexData, VortexExtendedDataType } from "../DataContext";
import { Scatter, ScatterPlotStyle } from "./Scatter";
import { Histogram, HistogramPlotStyle } from "./Histogram";
import PlotStyle from "./PlotStyle";
import Select from "../../Inputs/Select";
import plottable_variables from "./PlottableVariables";
import { Variable } from "./Variable";
import { parseValue } from "../../Inputs/parseValue";
// import PlotComponent from "./PlotComponent";

// from https://stackoverflow.com/questions/12467542/how-can-i-check-if-a-string-is-a-float
function checkFloat(val: string) {
    var floatRegex = /^-?\d+(?:[.,]\d*?(e[+-]\d)?)?$/;
    if (!floatRegex.test(val)) return false;

    const _val = parseFloat(val);
    if (isNaN(_val)) return false;
    return true;
}

function checkInt(val: string) {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val)) return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

export interface PlotVariableType {
    x?: keyof typeof plottable_variables;
    y?: keyof typeof plottable_variables;
}

const PlotComponent = ({ plot_type }: { plot_type: string }) => {
    const [plot_variables, setPlotVariables] = useState<PlotVariableType>({});
    return (
        <div className="w-full grid grid-cols-4">
            <PlotStyle>
                <PlotSidebar
                    plot_type={plot_type}
                    setPlotVariables={setPlotVariables}
                />
                <Chart plot_type={plot_type} plot_variables={plot_variables} />
            </PlotStyle>
        </div>
    );
};

const PlotSidebar = ({
    plot_type,
    setPlotVariables,
}: {
    plot_type: string;
    setPlotVariables: (data: PlotVariableType) => void;
}) => {
    const { filtered_vortex_data } = useContext(FilteredVortexData);
    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [variables, setVariables] = useState<Variable[]>([]);

    useEffect(() => {
        if (plot_type === "histogram") {
            setPlotVariables({ x: x });
        } else if (plot_type === "scatter") {
            setPlotVariables({ x: x, y: y });
        }
    }, [x, y]);

    /* when the data is set, loop through it and get the
     * relevant plotting variables
     */
    useEffect(() => {
        if (filtered_vortex_data.length > 0) {
            // loop over the metadata keys and find the minimum and maximum
            let variable_data = Object.keys(plottable_variables).map(
                (variable) => {
                    console.log("Getting info for " + variable);
                    const id = variable;
                    const name = plottable_variables[variable].name;

                    let variable_sub = filtered_vortex_data.map(
                        (dati) =>
                            dati[variable as keyof VortexExtendedDataType],
                    );

                    var dtype: string;
                    if (variable_sub.every((val) => checkInt(String(val)))) {
                        dtype = "int";
                    } else if (
                        variable_sub.every((val) => checkFloat(String(val)))
                    ) {
                        dtype = "float";
                    } else {
                        dtype = "";
                    }

                    const minValue = Math.min(
                        ...variable_sub.map((val) => parseValue(val, dtype, 0)),
                    );
                    const maxValue = Math.max(
                        ...variable_sub.map((val) => parseValue(val, dtype, 0)),
                    );

                    return {
                        id: id,
                        name: name,
                        minValue: minValue,
                        currentMin: minValue,
                        maxValue: maxValue,
                        currentMax: maxValue,
                        dtype: dtype,
                    } as Variable;
                },
            );

            // filter out non numeric metadata keys
            variable_data = variable_data.filter(
                (vari) => !isNaN(vari.minValue) || !isNaN(vari.maxValue),
            );

            setVariables(variable_data);
        }
    }, [filtered_vortex_data]);

    return (
        <div className="w-full flex flex-col justify-start items-start">
            <div className="w-full flex flex-col justify-start items-stretch h-1/3">
                <Select
                    id="select_x"
                    var_name="x"
                    variables={variables}
                    onChange={setX}
                    value={x}
                />
                {plot_type === "scatter" && (
                    <Select
                        id="select_y"
                        var_name="y"
                        variables={variables}
                        onChange={setY}
                        value={y}
                    />
                )}
            </div>
            <div className="w-full flex flex-col justify-start items-stretch h-2/3">
                {plot_type === "scatter" && <ScatterPlotStyle />}
                {plot_type === "histogram" && <HistogramPlotStyle />}
            </div>
        </div>
    );
};

const Chart = ({
    plot_variables,
    plot_type,
}: {
    plot_variables: PlotVariableType;
    plot_type: string;
}) => {
    return (
        <div className="w-full col-span-3 p-0">
            {plot_type === "histogram" && (
                <Histogram plot_variables={plot_variables} />
            )}
            {plot_type === "scatter" && (
                <Scatter plot_variables={plot_variables} />
            )}
        </div>
    );
};

export default PlotComponent;
