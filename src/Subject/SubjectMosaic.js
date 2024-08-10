export const SubjectMosaic = ({ url, longitude, latitude }) => {
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
