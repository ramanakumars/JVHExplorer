import { useEffect, useState } from "react";
import { API_query_vortices } from "./API";

export default function PerijoveSelector({ }) {
    const [perijove_data, setPerijoveData] = useState([]);

    useEffect(() => {
        API_query_vortices('_col=perijove&_facet=perijove&_nosuggest=1').then((data) => (
            setPerijoveData(
                data.facet_results.perijove.results.map((data_sub) => ({ perijove: data_sub.value, num_vortices: data_sub.count })).sort((a, b) => (a.perijove > b.perijove ? 1 : a.perijove < b.perijove ? -1 : 0))
            )
        ));
    }, []);

    return (
        <div className="container p-2">
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
        <a
            className="min-w-52 bg-primary-300 m-2 p-2 flex flex-col text-center hover:bg-primary-500 cursor-pointer text-black hover:text-black"
            href={"/perijove/" + perijove.perijove}
        >
            <span className="w-full">PJ {perijove.perijove}</span>
            <span># of vortices: {perijove.num_vortices}</span>
        </a>
    );
};
