import React, { useContext, useState, useEffect } from "react";
import { FilteredVortexData } from "./DataContext";
import VortexSample from "./VortexSample";
import { VortexExtendedDataType } from "./DataContext";
import EditableText from "../Inputs/EditableText";

export default function FilteredVortices({
    visible,
}: {
    visible: string | null;
}) {
    const { filtered_vortex_data } = useContext(FilteredVortexData);

    const page_size = 64;
    const [display_vortices, setDisplayVortices] = useState<
        VortexExtendedDataType[]
    >([]);
    const [search_text, setSearchText] = useState<string>("");
    const [n_pages, setNPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        setNPages(Math.ceil(filtered_vortex_data.length / page_size));
    }, [filtered_vortex_data]);

    useEffect(() => {
        let regex: RegExp;
        if (search_text === "" || search_text.trim() === "") {
            regex = new RegExp(".*", "gi");
        } else {
            // escape regex literals
            const escapedText = search_text.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&",
            );
            regex = RegExp(`.*${escapedText.toLowerCase()}.*`, "gi");
        }

        if (filtered_vortex_data.length > 0) {
            setDisplayVortices(
                filtered_vortex_data
                    .slice(page * page_size, (page + 1) * page_size)
                    .filter((vortex) => regex.test(vortex.id.toLowerCase())),
            );
        }
    }, [page, n_pages, search_text]);

    const nextPage = () => {
        setPage(Math.min(n_pages - 1, page + 1));
    };

    const prevPage = () => {
        setPage(Math.max(0, page - 1));
    };

    return (
        <div className={"w-full p-0 " + visible}>
            <div className="flex flex-row flex-nowrap my-4 items-center align-middle [&>*]:mx-4 w-full">
                <span className="flex-1 justify-start">&nbsp;</span>
                <span className="flex-1 flex flex-row flex-nowrap justify-center items-center [&>*]:mx-4">
                    <button
                        onClick={() => prevPage()}
                        className="w-8 h-8 bg-secondary-400 hover:bg-secondary-700"
                    >
                        &laquo;
                    </button>
                    <span className="h-8 flex items-center align-middle">
                        Page: {page + 1} of {n_pages}
                    </span>
                    <button
                        onClick={() => nextPage()}
                        className="w-8 h-8 bg-secondary-400 hover:bg-secondary-700"
                    >
                        &raquo;
                    </button>
                </span>
                <span className="flex-1 flex flex-nowrap flex-row justify-end items-center [&>*]:mx-2">
                    <input
                        type="text"
                        value={search_text}
                        placeholder={"Search vortex IDs"}
                        onChange={(event) => setSearchText(event.target.value)}
                        className="border-2 border-solid border-gray-300 px-2 rounded-md"
                    />
                </span>
            </div>
            <div
                className="grid grid-cols-8 gap-2"
                key={display_vortices.length}
            >
                {display_vortices.map((vortex) => (
                    <VortexSample key={vortex.id} vortex={vortex} />
                ))}
            </div>
        </div>
    );
}
