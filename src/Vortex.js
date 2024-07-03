import { useEffect, useState, useContext } from "react";
import { API_query } from "./API";

export default function Vortex({ vortex_id }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    API_query('id='+vortex_id).then((_data) => (
      setData(_data.rows[0])
    ))
  }, []);

  console.log(data);
  if (data.length > 0) {
    return <div>{vortex_id}</div>;
  } else {
    return <></>;
  }
}
