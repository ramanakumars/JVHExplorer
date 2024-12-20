import { createContext, useState } from "react";

export const PlotStyleContext = createContext({});

const PlotStyle = (props) => {
    const [PlotStyle, setPlotStyle] = useState({
        scatter: {
            size: 5,
            opacity: 1.0
        }
    });
    return (
        <PlotStyleContext.Provider value={{ PlotStyle: PlotStyle, setPlotStyle: setPlotStyle }}>
            {props.children}
        </PlotStyleContext.Provider>
    )
}

export default PlotStyle;