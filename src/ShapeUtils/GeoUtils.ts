const flat = 0.06487;
const beta = 1 / (1 - flat);
const re = 71492e3;
const rp = re / beta;
const pixscale = 7000e3 / 384;

export function radians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function degrees(radians: number): number {
    return (radians * 180) / Math.PI;
}

export const round = (number: number) => Math.round(number * 100) / 100;

export function sanitize_longitude(lon: number): number {
    while (lon < -180) lon += 360;
    while (lon > 180) lon -= 360;
    return lon;
}

export const colors: Record<string, string> = {
    red: "red",
    brown: "brown",
    white: "dodgerblue",
    dark: "#555",
    "white-brown": "sienna",
    "brown-white": "sienna",
    "white-red": "salmon",
    "red-white": "salmon",
    "brown-red": "tomato",
    "red-brown": "tomato"
};

interface Ellipse {
    x: number,
    y: number,
    rx: number,
    ry: number,
    angle: number
}

export function get_points(ellipse_params: Ellipse): [number, number][] {
    const N = 50;

    const angles: number[] = [];
    for (let i = 0; i < N; i++) {
        angles.push((i * 2 * Math.PI) / (N - 1));
    }

    const ellipse = angles.map((angle) => [
        ellipse_params.rx * Math.cos(angle),
        ellipse_params.ry * Math.sin(angle),
    ]);

    return ellipse.map((point) => [
        point[0] * Math.cos(ellipse_params.angle) -
        point[1] * Math.sin(ellipse_params.angle) + ellipse_params.x,
        point[0] * Math.sin(ellipse_params.angle) +
        point[1] * Math.cos(ellipse_params.angle) + ellipse_params.y,
    ]);
}

export function lonlat_to_pixel(
    lon: number,
    lat: number,
    x0: number,
    y0: number,
    lon0: number,
    lat0: number
): [number, number] {
    const rln = re / Math.sqrt(1 + ((rp / re) * Math.tan(radians(lat0))) ** 2);
    const rlt =
        rln /
        (Math.cos(radians(lat0)) *
            (Math.sin(radians(lat0)) ** 2 +
                ((re / rp) * Math.cos(radians(lat0))) ** 2));

    // difference between image center to pixel in degrees
    let dlat = lat0 - lat;
    let dlon = sanitize_longitude(lon0 - lon);

    const dy = radians(dlat) / (pixscale / rlt);
    const dx = radians(dlon) / (pixscale / rln);

    return [dx + x0, y0 + dy];
}

export function pixel_to_lonlat(
    dx: number,
    dy: number,
    x0: number,
    y0: number,
    lon0: number,
    lat0: number
): [number, number] {
    const rln = re / Math.sqrt(1 + ((rp / re) * Math.tan(radians(lat0))) ** 2);
    const rlt =
        rln /
        (Math.cos(radians(lat0)) *
            (Math.sin(radians(lat0)) ** 2 +
                ((re / rp) * Math.cos(radians(lat0))) ** 2));

    // difference between image center to pixel in degrees
    const dlat = degrees(dy * (pixscale / rlt));
    const dlon = degrees(dx * (pixscale / rln));

    return [lat0 + dlat, lon0 - dlon];
}


export function convert_to_lonlat(x: number, y: number, lon0: number, lat0: number): [number, number] {
    // find the distance in pixel coordinates from the center
    const dx = x;
    const dy = -y; // opposite to x because of image inversion

    // calculate the shape factors
    const rln = re / Math.sqrt(1 + ((rp / re) * Math.tan(radians(lat0))) ** 2);
    const rlt = rln / (Math.cos(radians(lat0)) *
        (Math.sin(radians(lat0)) ** 2 +
            ((re / rp) * Math.cos(radians(lat0))) ** 2));

    // difference between image center to pixel in degrees
    const dlat = degrees(dy * (pixscale / rlt));
    const dlon = degrees(dx * (pixscale / rln));

    return [lat0 + dlat, lon0 - dlon];
}