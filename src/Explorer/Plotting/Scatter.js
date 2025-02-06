import { Slider } from "../../Inputs/Slider";
import VortexPopup from "../../ShapeUtils/VortexPopup";
import { useState, useEffect, useContext } from "react";
import { FilteredVortexData } from "../Explorer";
import plottable_variables from "./PlottableVariables";
import { PlotStyleContext } from "./PlotStyle";
import Select from "../../Inputs/Select"
import Plot from "react-plotly.js";
import { RxCross2 } from "react-icons/rx";

export const Scatter = ({ plot_variables }) => {
    const [data, setData] = useState([])
    const [tooltip, setTooltip] = useState(null);
    const { filtered_vortex_data } = useContext(FilteredVortexData);
    const { PlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        if ((plot_variables.x) && (plot_variables.y)) {
            setData(
                [{
                    id: plottable_variables[plot_variables.y].name,
                    data: filtered_vortex_data.map((dati) => (
                        { x: dati[plot_variables.x] * plottable_variables[plot_variables.x].scale, y: dati[plot_variables.y] * plottable_variables[plot_variables.y].scale }
                    ))
                }]
            );
        }
    }, [plot_variables, filtered_vortex_data])

    const getTooltip = (index) => (
        <VortexPopup vortex={filtered_vortex_data[index]} link_enabled={true} />
    )

    const handleClick = (data) => {
        setTooltip({
            x: data.event.clientX,
            y: data.event.clientY,
            content: getTooltip(data.points[0].pointNumber)
        })
    }

    if (data.length > 0) {
        return (
            <>
                <Plot
                    data={[
                        {
                            x: data[0].data.map((dati) => dati.x),
                            y: data[0].data.map((dati) => dati.y),
                            type: 'scattergl',
                            mode: 'markers',
                            marker: { size: Number(PlotStyle.scatter.size) },
                            opacity: Number(PlotStyle.scatter.opacity)
                        }
                    ]}
                    layout={{
                        hovermode: "closest",
                        responsive: true,
                        useResizeHandler: true,
                        autosize: true,
                        width: '100%',
                        height: '100%',
                        xaxis: {
                            title: {
                                text: plottable_variables[plot_variables.x].name
                            },
                            type: PlotStyle.scatter.xscale
                        },
                        yaxis: {
                            title: {
                                text: plottable_variables[plot_variables.y].name
                            },
                            type: PlotStyle.scatter.yscale
                        }
                    }}
                    onClick={handleClick}
                />
                {tooltip && (
                    <div
                        className="p-2 rounded-xl border-2 border-primary-900 bg-white text-sm absolute flex flex-col"
                        style={{
                            top: tooltip.y,
                            left: tooltip.x,
                        }}
                    >
                        <div className="w-full p-2 flex flex-row justify-end">
                            <button onClick={() => setTooltip(null)} className="card-button">
                                <RxCross2 className="w-full h-4" />
                            </button>
                        </div>
                        {tooltip.content}
                    </div>
                )}
            </>
        )
    }
}

export const ScatterPlotStyle = () => {
    const [marker_size, setMarkerSize] = useState(5);
    const [opacity, setOpacity] = useState(1);
    const [xscale, setXScale] = useState('linear');
    const [yscale, setYScale] = useState('linear');
    const { PlotStyle, setPlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        if (marker_size) {
            setPlotStyle({ ...PlotStyle, scatter: { size: marker_size, xscale: xscale, yscale: yscale, opacity: opacity } });
        }
    }, [marker_size, xscale, yscale, opacity]);

    return (
        <div className="w-full p-2 flex flex-col justify-start items-stretch">
            <Slider
                minValue={1}
                maxValue={15}
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
                text={'Marker opacity'}
                type={'float'}
                name={'marker_opacity'}
                onChange={setOpacity}
            />
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
