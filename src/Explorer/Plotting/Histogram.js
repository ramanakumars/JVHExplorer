import { useState, useContext, useEffect } from "react";
import { FilteredVortexData } from "../Explorer";
import { PlotStyleContext } from "./PlotStyle";
import Select from "../../Inputs/Select";
import { Slider } from "../../Inputs/Slider";
import plottable_variables from "./PlottableVariables";
import Plot from "react-plotly.js";

export const Histogram = ({ plot_variables }) => {
    const [data, setData] = useState([])
    const { filtered_vortex_data } = useContext(FilteredVortexData);
    const { PlotStyle } = useContext(PlotStyleContext);

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
            <Plot
                data={[{
                    x: data.map((dati) => (Number(dati.x))),
                    type: 'histogram',
                    nbinsx: PlotStyle.histogram.numBins
                }]}
                layout={{
                    xaxis: {
                        title: plottable_variables[plot_variables.x].name
                    },
                    yaxis: {
                        title: "Count",
                        type: PlotStyle.histogram.yscale
                    },
                    responsive: true,
                    font: {
                        family: 'Material, Arial'
                    },
                    margin: {
                        l: 50,
                        r: 20,
                        b: 50,
                        t: 20,
                        pad: 4
                    },
                }}
                config={{
                    responsive: true
                }}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                useResizeHandler={true}
            />
        )
    }
}

export const HistogramPlotStyle = () => {
    const [yscale, setYScale] = useState('linear');
    const [numBins, setNumBins] = useState(20);
    const { PlotStyle, setPlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        setPlotStyle({ ...PlotStyle, histogram: { yscale: yscale, numBins: Number(numBins) } });
    }, [yscale, numBins]);

    return (
        <div className="w-full p-2 flex flex-col justify-start items-stretch">
            <Select
                id={'yscale'}
                var_name={'y-axis scale'}
                variables={[{ id: 'linear', name: "Linear" }, { id: 'log', name: 'Log' }]}
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
    )
}
