import { createElement, useContext, useEffect, useRef, useState } from "react"
import { VscEdit } from "react-icons/vsc"
import { RxCross2 } from "react-icons/rx"
import { GiHistogram } from "react-icons/gi"
import { PiChartScatterLight } from "react-icons/pi"
import { IconContext } from "react-icons/lib";
import Plot from "./Plot"

export default function PlotResults({ visible }) {
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
        <div className={"w-full p-2 " + visible}>
            {
                [_plots.current]
            }
            <div onClick={createNewPlot} className="w-full p-2 min-h-52 flex flex-row justify-center items-center cursor-pointer hover:bg-primary-200 text-6xl">
                +
            </div>
        </div>
    )
}

const PlotContainer = ({ id, onClose }) => {
    const [plot_type, setPlotType] = useState(null);

    return (
        <div className="w-full p-2 flex flex-col min-h-52">
            <div className="w-full p-2 flex flex-row justify-end">
                {plot_type &&
                    <button onClick={() => setPlotType(null)} className="card-button">
                        <VscEdit className="w-full h-4" />
                    </button>
                }
                <button onClick={() => onClose(id)} className="card-button">
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
