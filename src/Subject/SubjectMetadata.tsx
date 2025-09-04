import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { round } from "../ShapeUtils/GeoUtils";
import { SubjectMetadataType } from "../API/types";

export const SubjectMetadata = ({
    subject_metadata,
}: {
    subject_metadata: SubjectMetadataType | null;
}) => {
    const keys = ["latitude", "longitude", "perijove"];

    if (!subject_metadata) return null;

    return subject_metadata.perijove ? (
        <div className="h-28 w-full grid grid-cols-2 gap-4 justify-center items-center">
            <span className="font-bold text-right">Subject: </span>
            <span className="font-bold">{subject_metadata.subject_id}</span>
            {keys.map((key) => (
                <React.Fragment key={key}>
                    <div key={key + "_header"} className="text-right">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </div>
                    <div key={key + "_value"}>
                        {
                            key === "perijove"
                                ? subject_metadata[key] // perijove should be an int
                                : round(
                                      subject_metadata[
                                          key as keyof SubjectMetadataType
                                      ],
                                  ) // round the others to 2 dec places
                        }
                    </div>
                </React.Fragment>
            ))}
            <div className="col-span-2 text-center">
                <Link
                    to={
                        "https://www.zooniverse.org/projects/ramanakumars/jovian-vortex-hunter/talk/subjects/" +
                        subject_metadata.subject_id
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Subject Talk Page
                </Link>
            </div>
        </div>
    ) : (
        <></>
    );
};
