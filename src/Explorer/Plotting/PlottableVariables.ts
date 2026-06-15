const plottable_variables: Record<string, { name: string; scale: number }> = {
    angle: { name: "Angle [deg]", scale: 1 },
    physical_width: { name: "Width [km]", scale: 0.001 },
    physical_height: { name: "Height [km]", scale: 0.001 },
    aspect_ratio: { name: "Aspect Ratio", scale: 1 },
    physical_area: { name: "Area [km^2]", scale: 1e-6 },
    lon: { name: "Sys III Longitude [deg]", scale: 1 },
    lat: { name: "Planetographic Latitude [deg]", scale: 1 },
    perijove: { name: "Perijove", scale: 1 },
};

export default plottable_variables;

