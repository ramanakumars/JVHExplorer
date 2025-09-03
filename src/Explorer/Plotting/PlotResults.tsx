import React, { createElement, ReactElement, useRef, useState } from "react";
import { VscEdit } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import { GiHistogram } from "react-icons/gi";
import { PiChartScatterLight } from "react-icons/pi";
import { IconContext } from "react-icons/lib";
import PlotComponent from "./PlotComponent";

interface PlotContainerProps {
    id: number;
    onClose: (id: number) => void;
}

type PlotElement = ReactElement<PlotContainerProps>;

export default function PlotResults({ visible }: { visible: "hidden" | null }) {
    const [plots, setPlots] = useState<PlotElement[]>([]);
    const [plot_count, setPlotCount] = useState(0);
    const _plots = useRef<PlotElement[]>([]);

    const removePlot = (id: number) => {
        _plots.current = _plots.current.filter((plot) => plot.props.id !== id);
        setPlots(_plots.current);
    };

    const createNewPlot = () => {
        const newPlot = createElement(PlotContainer, {
            id: plot_count,
            key: plot_count + "_plot",
            onClose: removePlot,
        });
        _plots.current = [..._plots.current, newPlot as PlotElement];

        setPlots(_plots.current);
        setPlotCount(plot_count + 1);
    };

    return (
        <div className={"w-full p-2 " + visible}>
            {[_plots.current]}
            <div
                onClick={createNewPlot}
                className="w-full p-2 min-h-52 flex flex-row justify-center items-center cursor-pointer hover:bg-primary-200 text-6xl"
            >
                +
            </div>
        </div>
    );
}

const PlotContainer = ({ id, onClose }: PlotContainerProps) => {
    const [plot_type, setPlotType] = useState<string>("");

    return (
        <div className="w-full p-2 flex flex-col min-h-52">
            <div className="w-full p-2 flex flex-row justify-end">
                {plot_type && (
                    <button
                        onClick={() => setPlotType("")}
                        className="card-button"
                    >
                        <VscEdit className="w-full h-4" />
                    </button>
                )}
                <button onClick={() => onClose(id)} className="card-button">
                    <RxCross2 className="w-full h-4" />
                </button>
            </div>
            <div className="w-full p-2 min-h-[20rem] flex flex-row justify-center items-stretch">
                {!plot_type ? (
                    <ChoosePlotType onChange={setPlotType} />
                ) : (
                    <PlotComponent plot_type={plot_type} />
                )}
            </div>
        </div>
    );
};

const ChoosePlotType = ({
    onChange,
}: {
    onChange: (value: string) => void;
}) => {
    return (
        <IconContext.Provider value={{ size: "48" }}>
            <div className="w-full p-2 flex flex-row justify-center items-stretch [&>div]:cursor-pointer">
                <div
                    className="w-52 mx-5 hover:bg-primary-300 flex flex-col justify-center items-center"
                    onClick={() => onChange("histogram")}
                >
                    <>Histogram</>
                    <>
                        <GiHistogram />
                    </>
                </div>
                <div
                    className="w-52 h-full mx-5 hover:bg-primary-300 flex flex-col justify-center items-center"
                    onClick={() => onChange("scatter")}
                >
                    <>Scatter plot</>
                    <>
                        <PiChartScatterLight />
                    </>
                </div>
            </div>
        </IconContext.Provider>
    );
};
