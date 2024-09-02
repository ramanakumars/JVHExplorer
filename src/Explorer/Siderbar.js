import { InputMultiRange } from "../Inputs/InputMultiRange";
import { Checkbox } from "../Inputs/Checkbox";
import { useState, useContext, useEffect } from "react";
import { VortexData, FilteredVortexData } from "./Explorer";
import { setMinMax, compareMinMax } from "../ShapeUtils/MinMax";

export default function Sidebar ({ }) {
    const { vortex_data } = useContext(VortexData);
    const { _, setFilteredVortexData } = useContext(FilteredVortexData);

    const [size, setSize] = useState({ minValue: 0, currentMin: 0, currentMax: 5000, maxValue: 5000 });
    const [perijove, setPerijove] = useState({ minValue: 13, currentMin: 13, currentMax: 36, maxValue: 36 });
    const [num_extract, setNumExtracts] = useState({ minValue: 0, currentMin: 8, currentMax: 50, maxValue: 50 });
    const [aspect_ratio, setAspectRatio] = useState({ minValue: 1, currentMin: 1, currentMax: 5, maxValue: 5 });
    const [colors_checked, setColorsChecked] = useState({ white: true, brown: true, red: true, dark: true });

    useEffect(() => {
        if (vortex_data.length > 0) {
            const sizes = vortex_data.map((vortex) => (Math.max(vortex.physical_width, vortex.physical_height) / 1000.));
            const aspect_ratios = vortex_data.map((vortex) => (Math.max(vortex.physical_width, vortex.physical_height) / Math.min(vortex.physical_height, vortex.physical_width)));
            const perijoves = vortex_data.map((vortex) => (vortex.perijove));
            const num_extracts = vortex_data.map((vortex) => (vortex.num_extracts));
            setSize(setMinMax(sizes));
            setPerijove(setMinMax(perijoves));
            setAspectRatio(setMinMax(aspect_ratios));
            setNumExtracts(setMinMax(num_extracts));
        }
    }, [vortex_data]);

    useEffect(() => {
        if (vortex_data.length > 0) {
            setFilteredVortexData(
                vortex_data.filter((vortex) => {
                    const sizei = Math.max(vortex.physical_height, vortex.physical_width) / 1000.;
                    const aspect_ratioi = 1000 * sizei / Math.min(vortex.physical_height, vortex.physical_width);
                    return (compareMinMax(sizei, size) && compareMinMax(vortex.perijove, perijove) && compareMinMax(vortex.num_extracts, num_extract) && compareMinMax(aspect_ratioi, aspect_ratio) && (colors_checked[vortex.color]))
                })
            )
        }
    }, [size, perijove, num_extract, aspect_ratio, colors_checked]);

    return (
        <div className="py-2 px-4 col-span-1 bg-primary-200 min-h-screen box-border [&>*]:my-6">
            <InputMultiRange key={size.minValue + size.maxValue} minValue={size.minValue} maxValue={size.maxValue} type='float' text={'Size [km]'} onChange={(minValue, maxValue) => setSize(prevState => ({ ...prevState, currentMin: minValue, currentMax: maxValue }))} defaultMin={size.minValue} defaultMax={size.maxValue} />
            <InputMultiRange key={aspect_ratio.minValue + aspect_ratio.maxValue} minValue={aspect_ratio.minValue} maxValue={aspect_ratio.maxValue} step={0.5} type='float' text={'Aspect Ratio'} onChange={(minValue, maxValue) => setAspectRatio(prevState => ({ ...prevState, currentMin: minValue, currentMax: maxValue }))} defaultMin={aspect_ratio.minValue} defaultMax={aspect_ratio.maxValue} />
            <InputMultiRange key={perijove.minValue + perijove.maxValue} minValue={perijove.minValue} maxValue={perijove.maxValue} type='int' step={1} text={'Perijove'} onChange={(minValue, maxValue) => setPerijove(prevState => ({ ...prevState, currentMin: minValue, currentMax: maxValue }))} defaultMin={perijove.minValue} defaultMax={perijove.maxValue} />
            <InputMultiRange key={num_extract.minValue + num_extract.maxValue} minValue={num_extract.minValue} maxValue={num_extract.maxValue} step={1} type='int' text={'# of extracts'} onChange={(minValue, maxValue) => setNumExtracts(prevState => ({ ...prevState, currentMin: minValue, currentMax: maxValue }))} defaultMin={num_extract.minValue} defaultMax={num_extract.maxValue} />
            <div className="w-full m-0 flex flex-col">
                <Checkbox key={'white'} value={colors_checked.white} text='White vortices' name='white_vortices' onChange={(e) => setColorsChecked(prevState => ({ ...prevState, white: !prevState.white }))} />
                <Checkbox key={'red'} value={colors_checked.red} text='Red vortices' name='red_vortices' onChange={(e) => setColorsChecked(prevState => ({ ...prevState, red: !prevState.red }))} />
                <Checkbox key={'brown'} value={colors_checked.brown} text='Brown vortices' name='brown_vortices' onChange={(e) => setColorsChecked(prevState => ({ ...prevState, brown: !prevState.brown }))} />
                <Checkbox key={'dark'} value={colors_checked.dark} text='Dark vortices' name='dark_vortices' onChange={(e) => setColorsChecked(prevState => ({ ...prevState, dark: !prevState.dark }))} />
            </div>
        </div>
    )
}
