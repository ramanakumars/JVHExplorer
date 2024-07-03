import { useEffect, useState } from "react";
import { API_query_extracts, API_query_vortices } from "./API";
import { LoadingPage } from "./LoadingPage";

export default function Vortex({ vortex_id }) {
    const [data, setData] = useState(null);
    const [extract_data, setExtractData] = useState([]);
    const [loading_enabled, setLoading] = useState(true);

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

    return (
        <div className="container m-2 p-2 flex flex-row">
            <LoadingPage enabled={loading_enabled} text={"Loading"} />
            <h1>Vortex: {vortex_id}</h1>
        </div>
    );
}
