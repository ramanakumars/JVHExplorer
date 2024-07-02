import { useEffect, useState, useContext } from "react";
import vortexdata from './media/vortices.json';

export default function Vortex({ vortex_id }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const vortex = vortexdata.find(
      (vort) => vort.id === vortex_id
    );
    const perijove_data = require("./media/extracts/jvh_extracts_PJ" + vortex.perijove + ".json");
    setData(perijove_data.filter((vort) => (vort.vortex === vortex_id)));
  }, []);

  if (data.length > 0) {
    console.log(data);
    return <div>{vortex_id}</div>;
  } else {
    return <></>;
  }
}
