import { useEffect, useState } from "react";
import { API_query_extracts, API_query_vortices } from "./API";
import { LoadingPage } from "./LoadingPage";
import { get_points, radians, colors, round } from "./shape_utils";
import { VictoryAxis, VictoryChart, VictoryErrorBar, VictoryHistogram, VictoryLabel, VictoryPie, VictoryScatter, VictoryTooltip } from "victory";

export default function Vortex({ vortex_id }) {
    const [data, setData] = useState(null);
    const [extract_data, setExtractData] = useState([]);
    const [loading_enabled, setLoading] = useState(true);
    const [subject_ids, setSubjectIds] = useState([]);
    const [vortex_color, setColor] = useState("red");

    useEffect(() => {
        API_query_vortices("id=" + vortex_id).then((_data) =>
            setData(_data.rows[0])
        );
        API_query_extracts("_size=max&vortex=" + vortex_id).then((_data) =>
            setExtractData(_data.rows)
        );
    }, [vortex_id]);

    useEffect(() => {
        if (data && extract_data.length > 0) {
            setLoading(false);
        }
    }, [data, extract_data]);

    useEffect(() => {
        if (extract_data.length > 0) {
            setSubjectIds(extract_data.map((extract) => (extract.subject_id)).filter((value, index, array) => (array.indexOf(value) === index)))

            let arr = extract_data.map((extract) => (extract.color));
            let _color = arr.sort((a, b) =>
                arr.filter(v => v === a).length
                - arr.filter(v => v === b).length
            ).pop();

            setColor(colors[_color])
        }
    }, [extract_data]);

    return (
        <div className="container m-2 p-2 flex flex-col">
            <LoadingPage enabled={loading_enabled} text={"Loading"} />
            <h1>Vortex: {vortex_id}</h1>
            <div className="container p-2 flex flex-row [&>div]:w-[25%] max-h-96 [&>div]:mx-2">
                <VortexColorDistribution extracts={extract_data} />

                <VortexSizeDistribution extracts={extract_data} color={vortex_color} />

                <VortexLocationDistribution extracts={extract_data} color={vortex_color}/>
            </div>
            <div className="container p-2 grid grid-cols-6 gap-2">
                {subject_ids.map((subject_id) => {
                    const extract_sub = extract_data.filter((extract) => (extract.subject_id === subject_id));
                    return <Subject key={subject_id} subject_id={subject_id} extracts={extract_sub} />
                })}
            </div>
        </div>
    );
}

const VortexColorDistribution = ({ extracts }) => {
    const [color_fractions, setColors] = useState([]);

    useEffect(() => {
        const _color_fractions = extracts.map((extract) => (extract.color));
        const unique_color_fractions = _color_fractions.reduce((acc, val) => {
            acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
            return acc;
        }, {});

        const sorted_color_fractions = Object.entries(unique_color_fractions)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

        setColors(Object.keys(sorted_color_fractions).map((key) => ({ x: key, y: sorted_color_fractions[key] })));
    }, [extracts]);

    if (color_fractions.length > 0) {
        return (
            <div>
                <h1 className="w-full text-center">Vortex color: </h1>
                <VictoryPie
                    data={color_fractions}
                    colorScale={color_fractions.map((fraction) => (colors[fraction.x]))}
                    labels={({ datum }) => (datum.xName + ": " + datum.y + " (" + round(datum.y / extracts.length * 100) + "%)")}
                    labelComponent={<VictoryTooltip constrainToVisibleArea />}
                />
            </div>
        )
    }
}

const VortexSizeDistribution = ({ extracts, color }) => {
    const [vortex_sizes, setVortexSizes] = useState([]);
    const [mean_size, setMeanSize] = useState(null);
    const [mean_std, setMeanStd] = useState(null);

    useEffect(() => {
        setVortexSizes(extracts.map((extract) => (
            Math.max(Number(extract.physical_width), Number(extract.physical_height)) / 1000
        )));

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
            fill: color
        }
    };


    if (vortex_sizes.length > 0) {
        let sizes = vortex_sizes.map((size) => ({ x: size }));
        return (
            <div>
                <h1 className="w-full text-center">Vortex size: {round(mean_size)} &plusmn; {round(mean_std)} km </h1>
                <VictoryChart domainPadding={30} padding={{left: 60, right: 20, top: 20, bottom: 60}} width={400}>
                    <VictoryHistogram
                        style={style}
                        bins={Math.min(15, sizes.length)}
                        data={sizes}
                        labels={({ datum }) => (["(" + datum.x + " - " + datum.x1 + ")", "Count: " + datum.y])}
                        labelComponent={<VictoryTooltip constrainToVisibleArea />}
                    />
                    <VictoryAxis dependentAxis label={"Count"} />
                    <VictoryAxis label={"Size [km]"} />
                </VictoryChart>
            </div>
        )
    }
}


const VortexLocationDistribution = ({ extracts, color }) => {
    const [vortex_locations, setVortexLocations] = useState([]);
    const [location_statistics, setLocationStatistics] = useState({});

    useEffect(() => {
        setVortexLocations(extracts.map((extract) => ([extract.lon, extract.lat])));
    }, [extracts]);

    useEffect(() => {
        if (vortex_locations.length > 0) {
            const lon_stats = getMeanStd((vortex_locations).map((location) => (location[0])));
            const lat_stats = getMeanStd((vortex_locations).map((location) => (location[1])));
            setLocationStatistics({ lon: { mean: lon_stats.mean, stdev: lon_stats.stdev }, lat: { mean: lat_stats.mean, stdev: lat_stats.stdev } })
        }
    }, [vortex_locations]);

    if ((location_statistics.lon) && (location_statistics.lat)) {
        console.log(vortex_locations);
        console.log(location_statistics);
        const data = vortex_locations.map((location) => ({ x: location[0], y: location[1] }));
        const mean_data = [{ x: location_statistics.lon.mean, y: location_statistics.lat.mean, errorX: location_statistics.lon.stdev, errorY: location_statistics.lat.stdev}];
        return (
            <div>
                <div className="w-full grid grid-cols-8">
                    <span className="col-span-3 text-right">
                        Longitude:
                    </span>
                    <span className="col-span-2 text-right">
                        {round(location_statistics.lon.mean)}
                    </span>
                    <span className="text-center">
                        &plusmn;
                    </span>
                    <span>
                        {round(location_statistics.lon.stdev)} &deg;
                    </span>
                    <span>&nbsp;</span>
                    <span className="col-span-3 text-right">
                        Latitude:
                    </span>
                    <span className="col-span-2 text-right">
                        {round(location_statistics.lat.mean)}
                    </span>
                    <span className="text-center">
                        &plusmn;
                    </span>
                    <span>
                        {round(location_statistics.lat.stdev)} &deg;
                    </span>
                    <span>&nbsp;</span>
                </div>
                <VictoryChart domainPadding={30} padding={{left: 60, right: 20, top: 20, bottom: 60}} width={400}>
                    <VictoryAxis
                        dependentAxis
                        label="Planetographic Latitude [&deg;]"
                        axisLabelComponent={<VictoryLabel dy={-16}/>}
                        fixLabelOverlap={true}
                        style={{
                            axisLabel: {
                                fontFamily: "inherit",
                            },
                            tickLabels: {
                                fontFamily: "inherit",
                            }
                        }}
                    />
                    <VictoryAxis invertAxis label="Sys III Longitude [&deg;]" />
                    <VictoryScatter data={data} style={{data: {fill: color}}}/>
                    <VictoryErrorBar data={mean_data} symbol={"plus"} size={15} errorX={(datum) => (datum.errorX)} errorY={(datum) => (datum.errorY)}/>
                </VictoryChart>
            </div>
        )
    }

}

const Subject = ({ subject_id, extracts }) => {
    const [subject_url, setSubjectUrl] = useState(null);
    const [ellipses, setEllipses] = useState([]);

    useEffect(() => {
        fetch('https://www.zooniverse.org/api/subjects/' + subject_id, {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json; version=1",
                "Content-Type": "application/json",
            }
        }).then((result) => (
            result.json().then((data) => (setSubjectUrl(data.subjects[0].locations[0]['image/png'])))
        ));
    }, [subject_id]);

    useEffect(() => {
        setEllipses(extracts.map((extract) => (
            get_points({ x: extract.x, y: extract.y, rx: extract.rx, ry: extract.ry, angle: radians(extract.angle) })
        )));
    }, [extracts]);

    return (
        <div className="bg-primary-200">
            <h1>Subject: {subject_id}</h1>
            <svg viewBox="0 0 384 384">
                <image x="0" y="0" width="384" height="384" href={subject_url} />
                {ellipses.map((points, index) => (
                    <polyline key={subject_id + " " + index}
                        points={points.map((point) => (point[0] + "," + point[1])).join(" ")}
                        style={{ fill: "none", stroke: colors[extracts[index].color], strokeWidth: 2 }}
                    />
                ))}
            </svg>
        </div>
    )
}

const getMeanStd = (array) => {
    const mean = array.reduce((acc, val) => (acc + val)) / array.length;

    return {
        mean: mean,
        stdev: Math.sqrt(array.map((x) => (Math.pow(x - mean, 2))).reduce((acc, val) => (acc + val)) / array.length)
    }
}