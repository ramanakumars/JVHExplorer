import React, { createContext } from "react";
import { useEffect, useState } from "react"
import { API_query_subjects } from "../API";
import SubjectInfo from "./SubjectInfo";
import SubjectMap from "./SubjectMap";

export const SubjectMetadataContext = createContext(null);

export default function SubjectPage({ subject_id }) {
    const [subject_metadata, setSubjectMetadata] = useState({});

    useEffect(() => {
        API_query_subjects("subject_id=" + subject_id).then((subject_data) => {
            const metadata = subject_data[0];
            var longitude = 360 - metadata.longitude;
            if(longitude > 360) {
                longitude -= 360;
            } else if (longitude < 0) {
                longitude += 360;
            }

            setSubjectMetadata({...metadata, longitude: longitude});
        })
    }, [subject_id]);
    
    if (subject_metadata.perijove) {
        return (
            <div className="container m-2 p-2 flex flex-col" >
                <SubjectMetadataContext.Provider value={{subject_metadata: subject_metadata, setSubjectMetadata: setSubjectMetadata}}>
                    <SubjectInfo/>
                    <SubjectMap/>
                </SubjectMetadataContext.Provider>
            </div >
        )
    }
}
