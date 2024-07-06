import { useState, useEffect } from "react";
import { get_points, radians, colors } from "./shape_utils";

export default function Subject({ subject_id, extracts, title }) {
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
            <h1 className="text-sm w-full text-center">{
                title ?
                    title
                    :
                    <>
                        Subject: {subject_id}
                    </>
            }</h1>
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
