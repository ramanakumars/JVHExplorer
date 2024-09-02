import { createElement, useContext, useEffect, useRef, useState } from "react"
import { FilteredVortexData } from "./Explorer"
import { VscEdit } from "react-icons/vsc"
import { RxCross2 } from "react-icons/rx"
import { GiHistogram } from "react-icons/gi"
import { PiChartScatterLight } from "react-icons/pi"
import { IconContext } from "react-icons/lib";
import Select from "../Inputs/Select"
import { VictoryAxis, VictoryChart, VictoryErrorBar, VictoryHistogram, VictoryLabel, VictoryPie, VictoryScatter, VictoryTooltip } from "victory";

const plottable_variables = [
    "angle",
    "physical_width",
    "physical_height",
    "lon",
    "lat",
    "perijove",
]

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

export default function PlotResults({ }) {
    const [plots, setPlots] = useState([]);
    const [plot_count, setPlotCount] = useState(0);
    const _plots = useRef(plots);

    const removePlot = (id) => {
        _plots.current = _plots.current.filter((plot) => (plot.props.id != id));
        setPlots(_plots.current);
    }

    const createNewPlot = () => {
        _plots.current = [..._plots.current, createElement(
            PlotContainer,
            {
                id: plot_count,
                key: plot_count + "_plot",
                onClose: removePlot
            }
        )]

        setPlots(_plots.current);
        setPlotCount(plot_count + 1);
    }

    return (
        <div className="w-full p-2">
            {
                [_plots.current]
            }
            <CreatePlot onClick={createNewPlot} />
        </div>
    )
}

const CreatePlot = ({ onClick }) => {
    return (
        <div onClick={onClick} className="w-full p-2 min-h-52 flex flex-row justify-center items-center cursor-pointer hover:bg-primary-200 text-6xl">
            +
        </div>
    )
}

const PlotContainer = ({ id, onClose }) => {
    const [plot_type, setPlotType] = useState(null);

    return (
        <div className="w-full p-2 flex flex-col min-h-52">
            <div className="w-full p-2 flex flex-row justify-end">
                {plot_type &&
                    <button onClick={() => setPlotType(null)} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white hover:border-black">
                        <VscEdit className="w-full h-4" />
                    </button>
                }
                <button onClick={() => onClose(id)} className="mx-2 w-6 h-6 box-border inline-block bg-white border-2 p-0 rounded-full text-center align-center font-bold text-black hover:bg-white hover:border-black">
                    <RxCross2 className="w-full h-4" />
                </button>
            </div>
            <div className="w-full p-2 min-h-96 flex flex-row justify-center items-stretch">
                {(!plot_type) ?
                    <ChoosePlotType onChange={setPlotType} />
                    :
                    <Plot plot_type={plot_type} />
                }
            </div>
        </div>
    )
}

const ChoosePlotType = ({ onChange }) => {
    return (
        <IconContext.Provider value={{ size: 48 }}>
            <div className="w-full p-2 flex flex-row justify-center items-stretch [&>div]:cursor-pointer">
                <div className="w-52 mx-5 hover:bg-primary-300 flex flex-col justify-center items-center" onClick={() => onChange('histogram')}>
                    <>
                        Histogram
                    </>
                    <>
                        <GiHistogram />
                    </>
                </div>
                <div className="w-52 h-full mx-5 hover:bg-primary-300 flex flex-col justify-center items-center" onClick={() => onChange('scatter')}>
                    <>
                        Scatter plot
                    </>
                    <>
                        <PiChartScatterLight />
                    </>
                </div>
            </div>
        </IconContext.Provider>
    )
}

const Plot = ({ plot_type }) => {
    const { filtered_vortex_data, _ } = useContext(FilteredVortexData);
    const [plot_variables, setPlotVariables] = useState({});
    return (
        <div className="w-full grid grid-cols-4">
            <ChoosePlotVariables plot_type={plot_type} setPlotVariables={setPlotVariables} />
            <Chart plot_type={plot_type} plot_variables={plot_variables} />
        </div>
    )
}

const ChoosePlotVariables = ({ plot_type, setPlotVariables }) => {
    const { filtered_vortex_data, _ } = useContext(FilteredVortexData);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
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
            let variable_data = plottable_variables.map((variable) => {
                console.log('Getting info for ' + variable);
                let var_data = {};
                var_data.name = variable;

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
        <div className="w-full flex flex-col justify-center items-stretch">
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
                    { x: dati[plot_variables.x] }
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
                <VictoryAxis label={plot_variables.x} />
            </VictoryChart>
        )
    }

}

const Scatter = ({ plot_variables }) => {
    const [data, setData] = useState([])
    const { filtered_vortex_data, _ } = useContext(FilteredVortexData);

    useEffect(() => {
        if ((plot_variables.x) && (plot_variables.y)) {
            setData(
                filtered_vortex_data.map((dati) => (
                    { x: dati[plot_variables.x], y: dati[plot_variables.y] }
                ))
            );
        }
    }, [plot_variables, filtered_vortex_data])

    if (data.length > 0) {
        return (
            <VictoryChart domainPadding={30} padding={{ left: 60, right: 20, top: 20, bottom: 60 }}>
                <VictoryAxis
                    dependentAxis
                    label={plot_variables.y}
                    axisLabelComponent={<VictoryLabel dy={-16} />}
                    fixLabelOverlap={true}
                    style={{
                        axisLabel: {
                            fontFamily: "inherit",
                        },
                        tickLabels: {
                            fontFamily: "inherit",
                        }
                    }}
                />
                <VictoryAxis label={plot_variables.x} />
                <VictoryScatter data={data} style={{ data: { fill: 'black' } }} />
            </VictoryChart>
        )
    }
}