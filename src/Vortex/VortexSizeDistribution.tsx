import React, { useEffect, useState } from "react";
import { Extract } from "../API/types";
import DistributionDiv from "./DistributionDiv";
import getMeanStd from "./getMeanStd";
import {
    VictoryAxis,
    VictoryChart,
    VictoryHistogram,
    VictoryTooltip,
} from "victory";
import { round } from "../ShapeUtils/GeoUtils";

const VortexSizeDistribution = ({
    extracts,
    color,
}: {
    extracts: Extract[];
    color: string;
}) => {
    const [vortex_sizes, setVortexSizes] = useState<number[]>([]);
    const [mean_size, setMeanSize] = useState<number>(0);
    const [mean_std, setMeanStd] = useState<number>(0);

    useEffect(() => {
        setVortexSizes(
            extracts.map(
                (extract) =>
                    Math.max(
                        Number(extract.physical_width),
                        Number(extract.physical_height),
                    ) / 1000,
            ),
        );
    }, [extracts]);

    useEffect(() => {
        if (vortex_sizes.length > 0) {
            const statistics = getMeanStd(vortex_sizes);
            setMeanSize(statistics.mean);
            setMeanStd(statistics.stdev);
        }
    }, [vortex_sizes]);

    const style = {
        data: {
            fill: color,
        },
    };

    if (vortex_sizes.length > 0) {
        let sizes = vortex_sizes.map((size) => ({ x: size }));
        return (
            <DistributionDiv>
                <div className="w-full text-center">
                    Vortex size: {round(mean_size)} &plusmn; {round(mean_std)}{" "}
                    km{" "}
                </div>
                <VictoryChart
                    domainPadding={30}
                    padding={{ left: 60, right: 20, top: 20, bottom: 60 }}
                    width={400}
                >
                    <VictoryHistogram
                        style={style}
                        bins={Math.min(15, sizes.length)}
                        data={sizes}
                        labels={({ datum }) => [
                            "(" + datum.x + " - " + datum.x1 + ")",
                            "Count: " + datum.y,
                        ]}
                        labelComponent={
                            <VictoryTooltip constrainToVisibleArea />
                        }
                    />
                    <VictoryAxis dependentAxis label={"Count"} />
                    <VictoryAxis label={"Size [km]"} />
                </VictoryChart>
            </DistributionDiv>
        );
    }
};

export default VortexSizeDistribution;
