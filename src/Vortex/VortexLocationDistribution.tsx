import React, { useEffect, useState } from "react";
import { Extract } from "../API/types";
import DistributionDiv from "./DistributionDiv";
import getMeanStd from "./getMeanStd";
import {
    VictoryAxis,
    VictoryChart,
    VictoryErrorBar,
    VictoryLabel,
    VictoryScatter,
} from "victory";
import { round } from "../ShapeUtils/GeoUtils";

interface LocationStatisticsType {
    lon: { mean: number; stdev: number };
    lat: { mean: number; stdev: number };
}

const VortexLocationDistribution = ({
    extracts,
    color,
}: {
    extracts: Extract[];
    color: string;
}) => {
    const [vortex_locations, setVortexLocations] = useState<[number, number][]>(
        [],
    );
    const [location_statistics, setLocationStatistics] =
        useState<LocationStatisticsType>({
            lon: { mean: 0, stdev: 0 },
            lat: { mean: 0, stdev: 0 },
        });

    useEffect(() => {
        setVortexLocations(
            extracts.map((extract) => [extract.lon, extract.lat]),
        );
    }, [extracts]);

    useEffect(() => {
        if (vortex_locations.length > 0) {
            const lon_stats = getMeanStd(
                vortex_locations.map((location) => location[0]),
            );
            const lat_stats = getMeanStd(
                vortex_locations.map((location) => location[1]),
            );
            setLocationStatistics({
                lon: { mean: lon_stats.mean, stdev: lon_stats.stdev },
                lat: { mean: lat_stats.mean, stdev: lat_stats.stdev },
            });
        }
    }, [vortex_locations]);

    if (location_statistics.lon && location_statistics.lat) {
        const data = vortex_locations.map((location) => ({
            x: location[0],
            y: location[1],
        }));
        const mean_data = [
            {
                x: location_statistics.lon.mean,
                y: location_statistics.lat.mean,
                errorX: location_statistics.lon.stdev,
                errorY: location_statistics.lat.stdev,
            },
        ];
        return (
            <DistributionDiv>
                <div className="w-full grid grid-cols-2">
                    <span className="text-right">Longitude:</span>
                    <span className="text-center">
                        {round(location_statistics.lon.mean)} &plusmn;{" "}
                        {round(location_statistics.lon.stdev)} &deg;
                    </span>
                    <span className="text-right">Latitude:</span>
                    <span className="text-center">
                        {round(location_statistics.lat.mean)} &plusmn;{" "}
                        {round(location_statistics.lat.stdev)} &deg;
                    </span>
                </div>
                <VictoryChart
                    domainPadding={30}
                    padding={{ left: 60, right: 20, top: 20, bottom: 80 }}
                    height={300}
                    width={400}
                >
                    <VictoryAxis
                        dependentAxis
                        label="Planetographic Latitude [&deg;]"
                        axisLabelComponent={<VictoryLabel dy={-16} />}
                        fixLabelOverlap={true}
                        style={{
                            axisLabel: {
                                fontFamily: "inherit",
                            },
                            tickLabels: {
                                fontFamily: "inherit",
                            },
                        }}
                    />
                    <VictoryAxis invertAxis label="Sys III Longitude [&deg;]" />
                    <VictoryScatter
                        data={data}
                        style={{ data: { fill: color } }}
                    />
                    <VictoryErrorBar
                        data={mean_data}
                        errorX={(datum) => datum.errorX}
                        errorY={(datum) => datum.errorY}
                    />
                </VictoryChart>
            </DistributionDiv>
        );
    }
};

export default VortexLocationDistribution;
