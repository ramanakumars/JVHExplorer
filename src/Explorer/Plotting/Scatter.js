import { ResponsiveScatterPlotCanvas } from "@nivo/scatterplot";
import { Slider } from "../../Inputs/Slider";
import VortexPopup from "../../ShapeUtils/VortexPopup";
import { useState, useEffect, useContext } from "react";
import { FilteredVortexData } from "../Explorer";
import plottable_variables from "./PlottableVariables";
import { PlotStyleContext } from "./PlotStyle";
import Select from "../../Inputs/Select"
import { RxCross2 } from "react-icons/rx";

export const Scatter = ({ plot_variables }) => {
    const [data, setData] = useState([])
    const [tooltip, setTooltip] = useState(null);
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
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

    const getTooltip = (node) => (
        <VortexPopup vortex={filtered_vortex_data[node.index]} link_enabled={true} />
    )

    const handleClick = (node, event) => {
        setTooltip({
            x: event.clientX,
            y: event.clientY,
            content: getTooltip(node)
        })
    }

    const handleMouseEnter = (node, event) => {
        setHoveredNodeId(node.index); // Set the hovered node ID
    };

    const handleMouseLeave = () => {
        setHoveredNodeId(null); // Reset the hovered node ID
    };

    if (data.length > 0) {
        return (
            <>
                <ResponsiveScatterPlotCanvas
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 50, left: 90 }}
                    xScale={{ type: PlotStyle.scatter.xscale, min: 'auto', max: 'auto' }}
                    xFormat=">-.2f"
                    yScale={{ type: PlotStyle.scatter.yscale, min: 'auto', max: 'auto' }}
                    yFormat=">-.2f"
                    nodeSize={Number(PlotStyle.scatter.size)}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: plottable_variables[plot_variables.x].name,
                        legendPosition: 'middle',
                        legendOffset: 40
                    }}
                    onClick={handleClick}
                    tooltip={() => <></>}
                    // tooltip={(node) => tooltip(node)}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: plottable_variables[plot_variables.y].name,
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    renderNode={(ctx, node) => {
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
                        ctx.fillStyle = hoveredNodeId === node.index ? "red" : node.color;
                        ctx.fill();
                    }}
                    onMouseEnter={handleMouseEnter} // Handle mouse enter
                    onMouseLeave={handleMouseLeave} // Handle mouse leave
                    enableZoom={true} // Enable zoom
                    enablePan={true} // Enable panning
                    isInteractive={true} // Ensure interaction is enabled
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
    const [xscale, setXScale] = useState('linear');
    const [yscale, setYScale] = useState('linear');
    const { PlotStyle, setPlotStyle } = useContext(PlotStyleContext);

    useEffect(() => {
        if (marker_size) {
            setPlotStyle({ ...PlotStyle, scatter: { size: marker_size, xscale: xscale, yscale: yscale } });
        }
    }, [marker_size, xscale, yscale]);

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
