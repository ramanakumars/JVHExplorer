import { useState, useEffect, useContext, createContext } from "react";
import { FilteredVortexData } from "./Explorer";
import Select from "../Inputs/Select"
import { VictoryAxis, VictoryChart, VictoryHistogram, VictoryLabel, VictoryScatter, VictoryTooltip } from "victory";
import { Slider } from "../Inputs/Slider";

const plottable_variables = {
    angle: { name: "Angle [deg]", scale: 1 },
    physical_width: { name: "Width [km]", scale: 0.001 },
    physical_height: { name: "Height [km]", scale: 0.001 },
    lon: { name: "Sys III Longitude [deg]", scale: 1 },
    lat: { name: "Planetographic Latitude [deg]", scale: 1 },
    perijove: { name: "Perijove", scale: 1 },
}

const PlotStyleContext = createContext({});

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

const Plot = ({ plot_type }) => {
    const [plot_variables, setPlotVariables] = useState({});
    const [PlotStyle, setPlotStyle] = useState({
        scatter: {
            size: 1,
            opacity: 1.0
        }
    });
    return (
        <div className="w-full grid grid-cols-4">
            <PlotStyleContext.Provider value={{ PlotStyle: PlotStyle, setPlotStyle: setPlotStyle }}>
                <PlotSidebar plot_type={plot_type} setPlotVariables={setPlotVariables} />
                <Chart plot_type={plot_type} plot_variables={plot_variables} />
            </PlotStyleContext.Provider>
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
            console.log(filtered_vortex_data[0]);
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
        <div className="w-full col-span-3 p-4">
            {
                plot_type === 'histogram' && <Histogram plot_variables={plot_variables} />
            }
            {
                plot_type === 'scatter' && <Scatter plot_variables={plot_variables} />
            }
        </div>
    )
}

const Histogram = ({ plot_variables }) => {
    const [data, setData] = useState([])
    const { filtered_vortex_data, _ } = useContext(FilteredVortexData);

    useEffect(() => {
        if ((plot_variables.x)) {
            setData(
                filtered_vortex_data.map((dati) => (
                    { x: dati[plot_variables.x] * plottable_variables[plot_variables.x].scale }
                ))
            );
        }
    }, [plot_variables, filtered_vortex_data])

    if (data.length > 0) {
        return (
            <VictoryChart domainPadding={30} padding={{ left: 60, right: 20, top: 20, bottom: 60 }}>
                <VictoryHistogram
                    data={data}
                    labels={({ datum }) => (["(" + datum.x + " - " + datum.x1 + ")", "Count: " + datum.y])}
                    labelComponent={<VictoryTooltip constrainToVisibleArea />}
                />
                <VictoryAxis dependentAxis label={"Count"}
                    axisLabelComponent={<VictoryLabel dy={-18} />}
                    fixLabelOverlap={true} />
                <VictoryAxis label={plottable_variables[plot_variables.x].name} />
            </VictoryChart>
        )
    }

}

const Scatter = ({ plot_variables }) => {
    const [data, setData] = useState([])
    const { filtered_vortex_data } = useContext(FilteredVortexData);
    const { PlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        if ((plot_variables.x) && (plot_variables.y)) {
            setData(
                filtered_vortex_data.map((dati) => (
                    { x: dati[plot_variables.x] * plottable_variables[plot_variables.x].scale, y: dati[plot_variables.y] * plottable_variables[plot_variables.y].scale }
                ))
            );
        }
    }, [plot_variables, filtered_vortex_data])

    if (data.length > 0) {
        return (
            <VictoryChart domainPadding={30} padding={{ left: 60, right: 20, top: 20, bottom: 60 }}>
                <VictoryScatter data={data} style={{ data: { fill: 'red', opacity: PlotStyle.scatter.opacity } }} size={PlotStyle.scatter.size} />
                <VictoryAxis
                    dependentAxis
                    label={plottable_variables[plot_variables.y].name}
                    axisLabelComponent={<VictoryLabel dy={-16} />}
                    fixLabelOverlap={true}
                    style={{
                        axisLabel: {
                            fontFamily: "inherit",
                            fontSize: 12
                        },
                        tickLabels: {
                            fontFamily: "inherit",
                            fontSize: 12
                        }
                    }}
                />
                <VictoryAxis
                    label={plottable_variables[plot_variables.x].name}
                    style={{
                        axisLabel: {
                            fontSize: 12
                        },
                        tickLabels: {
                            fontSize: 12
                        }
                    }}
                    orientation="bottom"
                    offsetY={60}
                />
            </VictoryChart>
        )
    }
}

const ScatterPlotStyle = () => {
    const [marker_size, setMarkerSize] = useState(1);
    const [opacity, setOpacity] = useState(1.0);
    const { PlotStyle, setPlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        if (marker_size) {
            setPlotStyle({ ...PlotStyle, scatter: { ...PlotStyle.scatter, size: marker_size, opacity: opacity } });
        }
    }, [marker_size, opacity]);

    return (
        <div className="w-full p-2 flex flex-col justify-start items-stretch">
            <Slider
                minValue={1}
                maxValue={5}
                value={marker_size}
                text={'Marker size'}
                type={'int'}
                name={'marker_size'}
                onChange={setMarkerSize}
            />
            <Slider
                minValue={0}
                maxValue={1}
                value={opacity}
                text={'Opacity'}
                type={'float'}
                name={'opacity'}
                onChange={setOpacity}
            />
        </div>
    )
}

const HistogramPlotStyle = () => {
    return (
        <div>

        </div>
    )
}


export default Plot;