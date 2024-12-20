import { useState, useContext, useEffect } from "react";
import { FilteredVortexData } from "../Explorer";
import { PlotStyleContext } from "./PlotStyle";
import Select from "../../Inputs/Select";
import plottable_variables from "./PlottableVariables";
import { VictoryAxis, VictoryChart, VictoryHistogram, VictoryLabel, VictoryTooltip } from "victory";

export const Histogram = ({ plot_variables }) => {
    const [data, setData] = useState([])
    const { filtered_vortex_data } = useContext(FilteredVortexData);
    const { PlotStyle } = useContext(PlotStyleContext)

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
            <VictoryChart
                domainPadding={30} padding={{ left: 60, right: 20, top: 20, bottom: 60 }}
                scale={{ x: PlotStyle.histogram.xscale, y: PlotStyle.histogram.yscale }}
            >
                <VictoryHistogram
                    data={data}
                    labels={({ datum }) => (["(" + datum.x + " - " + datum.x1 + ")", "Count: " + datum.y])}
                    labelComponent={<VictoryTooltip constrainToVisibleArea />}
                />
                <VictoryAxis dependentAxis label={"Count"}
                    axisLabelComponent={<VictoryLabel dy={-18} />}
                    fixLabelOverlap={true}
                />
                <VictoryAxis label={plottable_variables[plot_variables.x].name} />
            </VictoryChart>
        )
    }
}

export const HistogramPlotStyle = () => {
    const [xscale, setXScale] = useState('linear');
    const [yscale, setYScale] = useState('linear');
    const { PlotStyle, setPlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        setPlotStyle({ ...PlotStyle, histogram: { xscale: xscale, yscale: yscale } });
    }, [xscale, yscale]);

    return (
        <div className="w-full p-2 flex flex-col justify-start items-stretch">
            <Select
                id={'xscale'}
                var_name={'x-axis scale'}
                variables={[{ id: 'linear', name: "Linear" }, { id: 'log', name: 'Log' }]}
                value={xscale}
                onChange={setXScale}
            />
            <Select
                id={'yscale'}
                var_name={'y-axis scale'}
                variables={[{ id: 'linear', name: "Linear" }, { id: 'log', name: 'Log' }]}
                value={yscale}
                onChange={setYScale}
            />
        </div>
    )
}
