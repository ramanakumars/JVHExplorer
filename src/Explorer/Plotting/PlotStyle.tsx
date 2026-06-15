import React, { createContext, useState } from "react";

export interface PlotStyleProps {
    scatter?: {
        size?: number;
        opacity?: number;
        xscale?: "linear" | "log";
        yscale?: "linear" | "log";
    };
    histogram?: {
        numBins?: number;
        yscale?: "linear" | "log";
        xscale?: "linear" | "log";
    };
}

export const PlotStyleContext = createContext<{
    PlotStyle: PlotStyleProps;
    setPlotStyle: (val: PlotStyleProps) => void;
}>({
    PlotStyle: {},
    setPlotStyle: () => null,
});

const PlotStyle = ({ children }: { children: React.ReactNode }) => {
    const [PlotStyle, setPlotStyle] = useState<PlotStyleProps>({
        scatter: {
            size: 5,
            opacity: 1.0,
        },
    });
    return (
        <PlotStyleContext.Provider
            value={{ PlotStyle: PlotStyle, setPlotStyle: setPlotStyle }}
        >
            {children}
        </PlotStyleContext.Provider>
    );
};

export default PlotStyle;
