import React from "react";
import { useEffect, useState } from "react"
import { API_query_subjects } from "../API";
import SubjectInfo from "./SubjectInfo";
import SubjectMap from "./SubjectMap";

export default function SubjectPage({ subject_id }) {
    const [subject_metadata, setSubjectMetadata] = useState({});

    useEffect(() => {
        API_query_subjects("subject_id=" + subject_id).then((subject_data) => (
            setSubjectMetadata(subject_data[0])
        ))
    }, [subject_id]);
    
    if (subject_metadata.perijove) {
        return (
            <div className="container m-2 p-2 flex flex-col" >
                <SubjectInfo subject_id={subject_id} subject_metadata={subject_metadata} />
                <SubjectMap subject_id={subject_id} subject_metadata={subject_metadata} />
            </div >
        )
    }
}
