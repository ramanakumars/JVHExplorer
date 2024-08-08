import React from "react";
import { useEffect, useState } from "react"
import { API_query_extracts, API_query_subject_image, API_query_subjects, API_query_vortices } from "./API";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Polygon, Polyline } from "react-leaflet";
import { convert_to_lonlat, round } from "./shape_utils";
import { Checkbox } from "./Inputs/Checkbox";
import { VortexEllipse } from "./shape_utils";

export default function SubjectPage({ subject_id }) {
    const [subject_metadata, setSubjectMetadata] = useState({});

    useEffect(() => {
        API_query_subjects("subject_id=" + subject_id).then((subject_data) => (
            setSubjectMetadata(subject_data[0])
        ))
    }, [subject_id]);
    
    console.log(subject_metadata);

    if (subject_metadata.perijove) {
        return (
            <div className="container m-2 p-2 flex flex-col" >
                <SubjectInfo subject_id={subject_id} subject_metadata={subject_metadata} />
                <SubjectMap subject_id={subject_id} subject_metadata={subject_metadata} />
            </div >
        )
    }
}

const SubjectInfo = ({ subject_id, subject_metadata }) => {
    const [subject_url, setSubjectUrl] = useState(null);
    const [subject_mosaic_url, setSubjectMosaicUrl] = useState(null);

    useEffect(() => {
        API_query_subject_image(subject_id).then((url) => setSubjectUrl(url));

    }, [subject_id]);

    useEffect(() => {
        if (subject_metadata.perijove) {
            setSubjectMosaicUrl('/PJs/PJimgs/PJ' + subject_metadata.perijove + '/globe_mosaic.png');
        }
    }, [subject_metadata]);


    return (
        <div className="w-full p-2 flex flex-wrap justify-evenly [&>div]:min-h-96 flex-grow-0">
            <div className="min-w-64 p-2 h-full flex items-center">
                <SubjectMetadata subject_metadata={subject_metadata} subject_id={subject_id} />
            </div>
            <div className="min-w-96 flex flex-col justify-center p-2">
                <img src={subject_url} className="max-w-80 max-h-80 block mx-auto" />
            </div>
            {subject_mosaic_url &&
                <div className="min-w-[730px] flex items-center">
                    <SubjectMosaic url={subject_mosaic_url} longitude={subject_metadata.longitude} latitude={subject_metadata.latitude} />
                </div>
            }
        </div>
    )
}

const SubjectMosaic = ({ url, longitude, latitude }) => {
    const crossx = longitude * (720 / 360) + 360;
    const crossy = Number(90 - latitude) * (360 / 180);

    return (
        <svg viewBox="0 0 720 360">
            <image x="0" y="0" width="720" height="360" href={url} />
            {(crossx && crossy) &&
                <g transform={"translate(" + crossx + " " + crossy + ")"}>
                    <line x1="-5" y1="-5" x2="5" y2="5" style={{ "stroke": "#000", "strokeWidth": "5" }} />
                    <line x1="-5" y1="5" x2="5" y2="-5" style={{ "stroke": "#000", "strokeWidth": "5" }} />
                </g>
            }
        </svg>
    )
}

const SubjectMetadata = ({ subject_metadata, subject_id }) => {
    const keys = ['latitude', 'longitude', 'perijove'];
    const [metadata, setMetadata] = useState(subject_metadata);

    useEffect(() => {
        var longitude = 360 - subject_metadata.longitude;
        if(longitude > 360) {
            longitude -= 360;
        } else if (longitude < 0) {
            longitude += 360;
        }

        setMetadata((prevState) => ({...prevState, longitude: longitude}));

    }, [subject_metadata]);

    return (
        metadata.perijove ?
            <div className="h-28 grid grid-cols-2 gap-4 justify-center items-center">
                <span className="font-bold text-right">Subject: </span>
                <span className="font-bold">{subject_id}</span>
                {
                    keys.map((key) => (
                        <React.Fragment key={key}>
                            <div key={key + "_header"} className="text-right">
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </div>
                            <div key={key + "_value"}>
                                {(key === 'perijove') ?
                                    metadata[key] // perijove should be an int
                                    :
                                    round(metadata[key])  // round the others to 2 dec places
                                }
                            </div>
                        </React.Fragment>
                    ))
                }
                <div className="col-span-2">
                    <Link to={'https://www.zooniverse.org/projects/ramanakumars/jovian-vortex-hunter/talk/subjects/' + subject_id} target='_blank' rel="noopener noreferrer">
                        Subject Talk Page
                    </Link>
                </div>
            </div> : <></>
    )
}

const SubjectMap = ({ subject_id, subject_metadata }) => {
    const [show_vortices, setShowVortices] = useState(false);
    const [vortices, setVortices] = useState([]);
    const [extracts, setExtracts] = useState([]);

    const perijove = subject_metadata.perijove;

    const edge_pixels = [[-192, -192], [-192, 192], [192, 192], [192, -192], [-192, -192]];
    const edge_lonlat = edge_pixels.map((pixel) => convert_to_lonlat(pixel[0], pixel[1], subject_metadata.longitude, subject_metadata.latitude));

    useEffect(() => {
        API_query_extracts("subject_id=" + subject_id).then((data) => (setExtracts(data.rows)));
    }, [subject_id]);

    useEffect(() => {
        if (extracts.length > 0) {
            const vortex_ids = extracts.map((extract) => (extract.vortex));
            const unique_vortex_ids = vortex_ids.filter((vort, index, arr) => (arr.indexOf(vort) === index));
            API_query_vortices("id__in=" + unique_vortex_ids.join(',')).then((data) => (setVortices(data.rows)));
        };
    }, [extracts]);

    console.log(extracts);

    return (
        <div className="w-full p-4 m-2 flex justify-center">
            <MapContainer
                center={[subject_metadata.latitude, subject_metadata.longitude]}
                zoom={5}
                scrollWheelZoom={true}
                className="!h-[800px]"
            >
                { (vortices.length > 0) &&
                    <div className="absolute text-white right-10 top-10 bg-slate-500 z-[500] px-2 text-lg" >
                        <Checkbox value={show_vortices} text={"Show vortices"} name={"vortices"} onChange={(e) => setShowVortices(!show_vortices)} />
                    </div>
                }

                <TileLayer
                    minZoom={0}
                    maxZoom={5}
                    url={"/PJs/tiles/PJ" + perijove + "/{z}/{x}/{-y}.png"}
                    attribution=""
                />
                <Polyline positions={edge_lonlat} pathOptions={{ color: 'black' }} opacity={1} />

                {(show_vortices && (vortices.length > 0)) &&
                    vortices.map((vortex) => (
                        <VortexEllipse vortex={vortex} key={vortex.id} />
                    ))
                }

            </MapContainer>
        </div>
    )
}