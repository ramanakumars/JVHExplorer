import { API_query_subject_image } from "../API";
import { useState, useEffect, useContext } from "react";
import { SubjectMosaic } from "./SubjectMosaic";
import { SubjectMetadata } from "./SubjectMetadata";
import { SubjectMetadataContext } from "./Subject";
import { sanitize_longitude } from "../ShapeUtils/GeoUtils";

export default function SubjectInfo({ }) {
    const [subject_url, setSubjectUrl] = useState(null);
    const [subject_mosaic_url, setSubjectMosaicUrl] = useState(null);

    const {subject_metadata, _} = useContext(SubjectMetadataContext);

    useEffect(() => {
        API_query_subject_image(subject_metadata.subject_id).then((url) => setSubjectUrl(url));
    }, [subject_metadata]);

    useEffect(() => {
        if (subject_metadata.perijove) {
            setSubjectMosaicUrl('/PJs/PJimgs/PJ' + subject_metadata.perijove + '/globe_mosaic.png');
        }
    }, [subject_metadata]);


    return (
        <div className="w-full p-2 flex flex-wrap justify-center [&>div]:min-h-96 flex-grow-0">
            <div className="min-w-64 p-2 h-full flex items-center">
                <SubjectMetadata subject_metadata={subject_metadata} subject_id={subject_metadata.subject_id} />
            </div>
            <div className="min-w-96 flex flex-col justify-center p-2">
                <img src={subject_url} className="max-w-80 max-h-80 block mx-auto" />
            </div>
            {subject_mosaic_url &&
                <div className="min-w-[730px] flex items-center">
                    <SubjectMosaic url={subject_mosaic_url} longitude={sanitize_longitude(360 - subject_metadata.longitude)} latitude={subject_metadata.latitude} />
                </div>
            }
        </div>
    )
}
