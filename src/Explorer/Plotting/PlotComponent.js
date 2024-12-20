import { useState, useEffect, useContext, createContext } from "react";
import { FilteredVortexData } from "../Explorer";
import { Scatter, ScatterPlotStyle } from "./Scatter";
import { Histogram, HistogramPlotStyle } from "./Histogram";
import PlotStyle from "./PlotStyle";
import Select from "../../Inputs/Select"
import plottable_variables from "./PlottableVariables";
// import PlotComponent from "./PlotComponent";


// from https://stackoverflow.com/questions/12467542/how-can-i-check-if-a-string-is-a-float
function checkFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?(e[+-]\d)?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

function checkInt(val) {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

const PlotComponent = ({ plot_type }) => {
    const [plot_variables, setPlotVariables] = useState({});
    return (
        <div className="w-full grid grid-cols-4">
            <PlotStyle>
                <PlotSidebar plot_type={plot_type} setPlotVariables={setPlotVariables} />
                <Chart plot_type={plot_type} plot_variables={plot_variables} />
            </PlotStyle>
        </div>
    )
}

const PlotSidebar = ({ plot_type, setPlotVariables }) => {
    const { filtered_vortex_data, _ } = useContext(FilteredVortexData);
    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [variables, setVariables] = useState([]);

    useEffect(() => {
        if (plot_type === 'histogram') {
            setPlotVariables({ x: x });
        } else if (plot_type === 'scatter') {
            setPlotVariables({ x: x, y: y });
        }
    }, [x, y]);

    /* when the data is set, loop through it and get the
     * relevant plotting variables
     */
    useEffect(() => {
        if (filtered_vortex_data.length > 0) {
            // loop over the metadata keys and find the minimum and maximum
            let variable_data = Object.keys(plottable_variables).map((variable) => {
                console.log('Getting info for ' + variable);
                let var_data = {};
                var_data.id = variable;
                var_data.name = plottable_variables[variable].name;

                let variable_sub = filtered_vortex_data.map((dati) => ("" + dati[variable]));

                var_data.minValue = var_data.currentMin = Math.min(...variable_sub);
                var_data.maxValue = var_data.currentMax = Math.max(...variable_sub);

                if (variable_sub.every(checkInt)) {
                    var_data.dtype = 'int'
                } else if (variable_sub.every(checkFloat)) {
                    var_data.dtype = 'float';
                } else {
                    var_data.dtype = null;
                }
                return var_data;
            });

            // filter out non numeric metadata keys
            variable_data = variable_data.filter(
                (vari) => (
                    ((!isNaN(vari.minValue)) || (!isNaN(vari.maxValue)))
                )
            );

            setVariables(variable_data);
        }
    }, [filtered_vortex_data]);


    return (
        <div className="w-full flex flex-col justify-start items-start">
            <div className="w-full flex flex-col justify-start items-stretch h-1/3">
                <Select
                    id='select_x'
                    var_name='x'
                    variables={variables}
                    onChange={setX}
                    value={x}
                />
                {plot_type === 'scatter' &&
                    <Select
                        id='select_y'
                        var_name='y'
                        variables={variables}
                        onChange={setY}
                        value={y}
                    />
                }
            </div>
            <div className="w-full flex flex-col justify-start items-stretch h-2/3">
                {plot_type === 'scatter' && <ScatterPlotStyle />}
                {plot_type === 'histogram' && <HistogramPlotStyle />}
            </div>
        </div>
    )
}

const Chart = ({ plot_variables, plot_type }) => {
    return (
        <div className="w-full col-span-3 p-0">
            {
                plot_type === 'histogram' && <Histogram plot_variables={plot_variables} />
            }
            {
                plot_type === 'scatter' && <Scatter plot_variables={plot_variables} />
            }
        </div>
    )
}



export default PlotComponent;