import { useState, useEffect } from "react";
import { get_points, radians, colors } from "./shape_utils";
import { API_query_subject_image } from "./API";

export default function Subject({ subject_id, extracts, title }) {
    const [subject_url, setSubjectUrl] = useState(null);
    const [ellipses, setEllipses] = useState([]);

    useEffect(() => {
        API_query_subject_image(subject_id).then((url) => (setSubjectUrl(url)))
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
