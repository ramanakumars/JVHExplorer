import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_query_subjects } from "../API";
import { lonlat_to_pixel } from "../ShapeUtils/GeoUtils";
import SubjectImage from "../SubjectImage";

export default function VortexSample({ vortex }) {
    const [ellipse_path, setEllipsePath] = useState([{ x: 192, y: 192, rx: 30, ry: 30, angle: 0 }]);

    useEffect(() => {
        API_query_subjects("subject_id=" + vortex.closest_subject_id).then((subject_data) => {
            const position = lonlat_to_pixel(-vortex.lon, vortex.lat, 192, 192, subject_data[0].longitude, subject_data[0].latitude);
            setEllipsePath([{ x: 384 - position[0], y: position[1], rx: vortex.rx, ry: vortex.ry, angle: vortex.angle, color: vortex.color }]);
        });
    }, [vortex]);

    return (
        <div>
            <Link to={'/vortex/' + vortex.id} target='_blank' rel="noopener noreferrer" className="text-primary-800 hover:text-primary-300 hover:[&>div]:bg-primary-600">
                <SubjectImage subject_id={vortex.closest_subject_id} extracts={ellipse_path} title={"Vortex: " + vortex.id} />
            </Link>
        </div>
    )
}
