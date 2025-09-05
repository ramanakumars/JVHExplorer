import React, { useEffect, useState } from "react";
import { Extract } from "../API/types";
import DistributionDiv from "./DistributionDiv";
import {
    VictoryPie,
    VictoryTooltip,
} from "victory";
import { colors, round } from "../ShapeUtils/GeoUtils";

interface ColorFraction {
    x: string;
    y: number;
}

const VortexColorDistribution = ({ extracts }: { extracts: Extract[] }) => {
    const [color_fractions, setColors] = useState<ColorFraction[]>([]);

    useEffect(() => {
        const colorFractions: string[] = extracts.map(
            (extract) => extract.color,
        );
        const unique_color_fractions = colorFractions.reduce(
            (acc: Record<string, number>, val: string) => {
                acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
                return acc;
            },
            {},
        );

        const sorted_color_fractions = Object.entries(unique_color_fractions)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .reduce(
                (r: Record<string, number>, [k, v]) => ({
                    ...r,
                    [k]: v as number,
                }),
                {},
            );

        setColors(
            Object.keys(sorted_color_fractions).map(
                (key): ColorFraction => ({
                    x: key,
                    y: sorted_color_fractions[key],
                }),
            ),
        );
    }, [extracts]);

    if (color_fractions.length > 0) {
        return (
            <DistributionDiv>
                <div className="w-full text-center">
                    Vortex color: {color_fractions[0].x}
                </div>
                <VictoryPie
                    padding={20}
                    padAngle={1}
                    width={400}
                    height={300}
                    data={color_fractions}
                    colorScale={color_fractions.map(
                        (fraction) => colors[fraction.x],
                    )}
                    labels={({ datum }) =>
                        datum.xName +
                        ": " +
                        datum.y +
                        " (" +
                        round((datum.y / extracts.length) * 100) +
                        "%)"
                    }
                    labelComponent={<VictoryTooltip constrainToVisibleArea />}
                />
            </DistributionDiv>
        );
    }

    return null;
};

export default VortexColorDistribution;
