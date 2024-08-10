import { useEffect, useRef, useState } from "react";
import { API_query_vortices } from "./API";
import { Link } from "react-router-dom";
import { LoadingPage } from "./LoadingPage";

export default function PerijoveSelector({ }) {
    const [perijove_data, setPerijoveData] = useState([]);
    const [loading_enabled, setLoading] = useState(true);

    useEffect(() => {
        API_query_vortices('_col=perijove&_facet=perijove&_nosuggest=1').then((data) => (
            setPerijoveData(
                data.facet_results.perijove.results.map((data_sub) => ({ perijove: data_sub.value, num_vortices: data_sub.count })).sort((a, b) => (a.perijove > b.perijove ? 1 : a.perijove < b.perijove ? -1 : 0))
            )
        ));
    }, []);

    useEffect(() => {
        if(perijove_data.length > 0) {
            setLoading(false);
        }
    }, [perijove_data]);

    return (
        <div className="container p-2">
            <LoadingPage  enabled={loading_enabled} text="Loading..."/>
            <div className="grid grid-cols-4 gap-x-1.5">
                {perijove_data.map((perijove) => (
                    <Card perijove={perijove} key={perijove.perijove} />
                ))}
            </div>
        </div>
    );
}

const Card = ({ perijove }) => {
    return (
        <Link
            className="min-w-52 min-h-52 bg-primary-200 bg-opacity-95 m-2 p-2 flex flex-col justify-center items-center bg-cover text-center bg-blend-overlay hover:bg-opacity-45 hover:bg-black cursor-pointer font-bold text-black hover:text-white"
            style={{ "backgroundImage": "url('/PJs/PJimgs/PJ" + perijove.perijove + "/globe_mosaic.png')"}}
            to={"/perijove/" + perijove.perijove}
        >
            <span className="w-fulf">PJ {perijove.perijove}</span>
            <span># of vortices: {perijove.num_vortices}</span>
        </Link>
    );
};
