import { useEffect, useState } from "react";
import { API_query_extracts, API_query_vortices } from "./API";
import { LoadingPage } from "./LoadingPage";

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
            <div className="container p-2 grid grid-cols-6 gap-2">
                {subject_ids.map((subject_id) => {
                    const extract_sub = extract_data.filter((extract) => (extract.subject_id === subject_id));
                    return <Subject subject_id={subject_id} extracts={extract_sub} />
                })}
            </div>
        </div>
    );
}

const Subject = ({ subject_id, extracts }) => {
    const [subject_url, setSubjectUrl] = useState(null);

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

    return (
        <div key={subject_id}>
            <h1>Subject: {subject_id}</h1>
            Number of extracts with this subject: { extracts.length }
            <img src={subject_url} />
        </div>

    )
}