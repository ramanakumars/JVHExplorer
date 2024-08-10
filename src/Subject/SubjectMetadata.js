import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { round } from "../ShapeUtils/GeoUtils";

export const SubjectMetadata = ({ subject_metadata, subject_id }) => {
    const keys = ['latitude', 'longitude', 'perijove'];
    const [metadata, setMetadata] = useState(subject_metadata);

    useEffect(() => {
        var longitude = 360 - subject_metadata.longitude;
        if(longitude > 360) {
            longitude -= 360;
        } else if (longitude < 0) {
            longitude += 360;
        }

        setMetadata((prevState) => ({...prevState, longitude: longitude}));

    }, [subject_metadata]);

    return (
        metadata.perijove ?
            <div className="h-28 w-full grid grid-cols-2 gap-4 justify-center items-center">
                <span className="font-bold text-right">Subject: </span>
                <span className="font-bold">{subject_id}</span>
                {
                    keys.map((key) => (
                        <React.Fragment key={key}>
                            <div key={key + "_header"} className="text-right">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </div>
                            <div key={key + "_value"}>
                                {(key === 'perijove') ?
                                    metadata[key] // perijove should be an int
                                    :
                                    round(metadata[key])  // round the others to 2 dec places
                                }
                            </div>
                        </React.Fragment>
                    ))
                }
                <div className="col-span-2 text-center">
                    <Link to={'https://www.zooniverse.org/projects/ramanakumars/jovian-vortex-hunter/talk/subjects/' + subject_id} target='_blank' rel="noopener noreferrer">
                        Subject Talk Page
                    </Link>
                </div>
            </div> : <></>
    )
}
