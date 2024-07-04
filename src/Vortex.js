import { useEffect, useState } from "react";
import { API_query_extracts, API_query_vortices } from "./API";
import { LoadingPage } from "./LoadingPage";
import { get_points, radians, colors, round } from "./shape_utils";
import { VictoryAxis, VictoryChart, VictoryHistogram, VictoryPie, VictoryTooltip } from "victory";

export default function Vortex({ vortex_id }) {
    const [data, setData] = useState(null);
    const [extract_data, setExtractData] = useState([]);
    const [loading_enabled, setLoading] = useState(true);
    const [subject_ids, setSubjectIds] = useState([]);

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
        }
    }, [extract_data]);

    return (
        <div className="container m-2 p-2 flex flex-col">
            <LoadingPage enabled={loading_enabled} text={"Loading"} />
            <h1>Vortex: {vortex_id}</h1>
            <div className="container p-2 flex flex-row [&>div]:min-w-[25%] max-h-96">
                <div>
                    <h1>Vortex color: </h1>
                    <VortexColorDistribution extracts={extract_data} />
                </div>

                <div>
                    <h1>Vortex size:</h1>
                    <VortexSizeDistribution extracts={extract_data} />
                </div>
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
    const [color_fractions, setColors] = useState(null);

    useEffect(() => {
        const _color_fractions = extracts.map((extract) => (extract.color));
        const unique_color_fractions = _color_fractions.reduce((acc, val) => {
            acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
            return acc;
        }, {});

        setColors(Object.keys(unique_color_fractions).map((key) => ({ x: key, y: unique_color_fractions[key] })));
    }, [extracts]);

    if (color_fractions) {
        return (
            <VictoryPie
                data={color_fractions}
                colorScale={color_fractions.map((fraction) => (colors[fraction.x]))}
                labels={({ datum }) => (datum.xName + ": " + datum.y + " (" + round(datum.y / extracts.length * 100) + "%)")}
                labelComponent={<VictoryTooltip constrainToVisibleArea />}
            />
        )
    }
}

const VortexSizeDistribution = ({ extracts }) => {
    const [vortex_sizes, setVortexSizes] = useState([]);
    const [color, setColor] = useState("red");

    useEffect(() => {
        setVortexSizes(extracts.map((extract) => (
            Math.max(Number(extract.physical_width), Number(extract.physical_height)) / 1000
        )));

        let arr = extracts.map((extract) => (extract.color));
        let _color = arr.sort((a,b) =>
            arr.filter(v => v===a).length
          - arr.filter(v => v===b).length
        ).pop();

        setColor(colors[_color])
    }, [extracts]);

    const style = {
        data: {
            fill: color
        }
    };


    if (vortex_sizes.length > 5) {
        let sizes = vortex_sizes.map((size) => ({ x: size }));
        return (
            <VictoryChart domainPadding={5}>
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