import { createContext, useContext, useEffect, useState } from "react"
import { API_query_extracts, API_query_subjects, API_query_vortices } from "./API";
import { InputMultiRange } from "./Inputs/InputMultiRange";
import Subject from "./Subject";
import { colors, lonlat_to_pixel } from "./shape_utils";
import { Checkbox } from "./Inputs/Checkbox";

const VortexData = createContext(null);
const FilteredVortexData = createContext(null);

export default function Explorer({ }) {
    const [search_params, setSearchParams] = useState({});
    const [vortex_data, setVortexData] = useState([]);
    const [filtered_vortex_data, setFilteredVortexData] = useState([]);

    useEffect(() => {
        API_query_vortices("_size=max").then((data) => (setVortexData(data.rows)));
    }, []);

    return (
        <div className="container m-0 grid grid-cols-5 gap-2">
            <FilteredVortexData.Provider value={{ filtered_vortex_data: filtered_vortex_data, setFilteredVortexData: setFilteredVortexData }}>
                <VortexData.Provider value={{ vortex_data: vortex_data, setVortexData: setVortexData }}>
                    <Sidebar />
                </VortexData.Provider>
                <ExplorerResults />
            </FilteredVortexData.Provider>
        </div >
    )
}

const setMinMax = (data) => {
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    return {
        minValue: minValue, maxValue: maxValue, currentMin: minValue, currentMax: maxValue
    }
}

const compareMinMax = (val, range) => (
    ((val >= range.currentMin) && (val <= range.currentMax))
)

const Sidebar = ({ }) => {
    const { vortex_data } = useContext(VortexData);
    const { _, setFilteredVortexData } = useContext(FilteredVortexData);

    const [size, setSize] = useState({ minValue: 0, currentMin: 0, currentMax: 5000, maxValue: 5000 });
    const [perijove, setPerijove] = useState({ minValue: 13, currentMin: 13, currentMax: 36, maxValue: 36 });
    const [num_extract, setNumExtracts] = useState({ minValue: 0, currentMin: 8, currentMax: 50, maxValue: 50 });
    const [colors_checked, setColorsChecked] = useState({white: true, brown: true, red: true, dark: true});

    useEffect(() => {
        if (vortex_data.length > 0) {
            const sizes = vortex_data.map((vortex) => (Math.max(vortex.physical_width, vortex.physical_height) / 1000.));
            const perijoves = vortex_data.map((vortex) => (vortex.perijove));
            const num_extracts = vortex_data.map((vortex) => (vortex.num_extracts));
            setSize(setMinMax(sizes));
            setPerijove(setMinMax(perijoves));
            setNumExtracts(setMinMax(num_extracts));
        }
    }, [vortex_data]);

    useEffect(() => {
        if (vortex_data.length > 0) {
            setFilteredVortexData(
                vortex_data.filter((vortex) => {
                    const sizei = Math.max(vortex.physical_height, vortex.physical_width) / 1000.;
                    return (compareMinMax(sizei, size) && compareMinMax(vortex.perijove, perijove) && compareMinMax(vortex.num_extracts, num_extract) && (colors_checked[vortex.color]))
                })
            )
        }
    }, [size, perijove, num_extract, colors_checked]);

    return (
        <div className="p-2 col-span-1 bg-primary-200 min-h-screen box-border">
            <InputMultiRange key={size.minValue + size.maxValue} minValue={size.minValue} maxValue={size.maxValue} type='float' text={'Size [km]'} onChange={(minValue, maxValue) => setSize(prevState => ({ ...prevState, currentMin: minValue, currentMax: maxValue }))} defaultMin={size.minValue} defaultMax={size.maxValue} />
            <InputMultiRange key={perijove.minValue + perijove.maxValue} minValue={perijove.minValue} maxValue={perijove.maxValue} type='int' text={'Perijove'} onChange={(minValue, maxValue) => setPerijove(prevState => ({ ...prevState, currentMin: minValue, currentMax: maxValue }))} defaultMin={perijove.minValue} defaultMax={perijove.maxValue} />
            <InputMultiRange key={num_extract.minValue + num_extract.maxValue} minValue={num_extract.minValue} maxValue={num_extract.maxValue} type='int' text={'# of extracts'} onChange={(minValue, maxValue) => setNumExtracts(prevState => ({ ...prevState, currentMin: minValue, currentMax: maxValue }))} defaultMin={num_extract.minValue} defaultMax={num_extract.maxValue} />
            <Checkbox key={'white'} value={colors_checked.white} text='White vortices' name='white_vortices' onChange={(e) => setColorsChecked(prevState => ({...prevState, white: !prevState.white}))} />
            <Checkbox key={'red'} value={colors_checked.red} text='Red vortices' name='red_vortices' onChange={(e) => setColorsChecked(prevState => ({...prevState, red: !prevState.red}))} />
            <Checkbox key={'brown'} value={colors_checked.brown} text='Brown vortices' name='brown_vortices' onChange={(e) => setColorsChecked(prevState => ({...prevState, brown: !prevState.brown}))} />
            <Checkbox key={'dark'} value={colors_checked.dark} text='Dark vortices' name='dark_vortices' onChange={(e) => setColorsChecked(prevState => ({...prevState, dark: !prevState.dark}))} />
        </div>
    )
}

const ExplorerResults = ({ }) => {
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
            <div className="flex flex-row flex-nowrap justify-evenly my-4">
                <button onClick={() => prevPage()}>&laquo;</button>
                Page: {page + 1} of {n_pages}
                <button onClick={() => nextPage()}>&raquo;</button>
            </div>
            <div className="grid grid-cols-8 gap-2">
                {display_vortices.map((vortex) => (
                    <VortexSample key={vortex.id} vortex={vortex} />
                ))}
            </div>
        </div>
    )
}


const VortexSample = ({ vortex }) => {
    const [ellipse_path, setEllipsePath] = useState([{ x: 192, y: 192, rx: 30, ry: 30, angle: 0 }]);

    useEffect(() => {
        API_query_subjects("subject_id=" + vortex.closest_subject_id).then((subject_data) => {
            const position = lonlat_to_pixel(-vortex.lon, vortex.lat, 192, 192, subject_data[0].longitude, subject_data[0].latitude);
            setEllipsePath([{ x: 384 - position[0], y: position[1], rx: vortex.rx, ry: vortex.ry, angle: vortex.angle, color: vortex.color }]);
        });
    }, [vortex]);

    return (
        <div>
            <a href={'/vortex/' + vortex.id} target='_blank' rel="noopener noreferrer" className="text-primary-800 hover:text-primary-500">
                <Subject subject_id={vortex.closest_subject_id} extracts={ellipse_path} title={"Vortex: " + vortex.id} />
            </a>
        </div>
    )
}