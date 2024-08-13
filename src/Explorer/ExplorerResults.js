import { useContext, useState, useEffect } from "react";
import { FilteredVortexData } from "./Explorer";
import VortexSample from "./VortexSample";

export default function ExplorerResults({ }) {
    const { filtered_vortex_data, _ } = useContext(FilteredVortexData)

    const page_size = 64;
    const [display_vortices, setDisplayVortices] = useState([]);
    const [n_pages, setNPages] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        setNPages(Math.ceil(filtered_vortex_data.length / page_size));
    }, [filtered_vortex_data]);

    useEffect(() => {
        if (filtered_vortex_data.length > 0) {
            setDisplayVortices(
                filtered_vortex_data.slice(page * page_size, (page + 1) * page_size)
            );
        }
    }, [page, n_pages]);

    const nextPage = () => {
        setPage(Math.min(n_pages - 1, page + 1));
    }

    const prevPage = () => {
        setPage(Math.max(0, page - 1));
    }

    return (
        <div className="p-2 col-span-4">
            <div className="flex flex-row flex-nowrap justify-center my-4 items-center align-middle [&>*]:mx-4">
                <button onClick={() => prevPage()} className="w-8 h-8 bg-secondary-400 hover:bg-secondary-700">&laquo;</button>
                <span className="h-8 flex items-center align-middle">Page: {page + 1} of {n_pages}</span>
                <button onClick={() => nextPage()} className="w-8 h-8 bg-secondary-400 hover:bg-secondary-700">&raquo;</button>
            </div>
            <div className="grid grid-cols-8 gap-2" key={display_vortices.length}>
                {display_vortices.map((vortex) => (
                    <VortexSample key={vortex.id} vortex={vortex} />
                ))}
            </div>
        </div>
    )
}

