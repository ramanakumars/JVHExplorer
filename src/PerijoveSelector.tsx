import React, { FC, useEffect, useState } from "react";
import { API_query_vortices } from "./API/API";
import { Link } from "react-router-dom";
import { LoadingPage } from "./LoadingPage";

interface PerijoveData {
  perijove: number;
  num_vortices: number;
}

const PerijoveSelector: FC = () => {
  const [perijoveData, setPerijoveData] = useState<PerijoveData[]>([]);
  const [loadingEnabled, setLoading] = useState(true);

  useEffect(() => {
    API_query_vortices('_col=perijove&_facet=perijove&_nosuggest=1').then((data) => (
      setPerijoveData(
        data.facet_results.perijove.results.map((dataSub: any) => ({
          perijove: dataSub.value,
          num_vortices: dataSub.count
        })).sort((a: PerijoveData, b: PerijoveData) => (a.perijove > b.perijove ? 1 : a.perijove < b.perijove ? -1 : 0))
      )
    ));
  }, []);

  useEffect(() => {
    if (perijoveData.length > 0) {
      setLoading(false);
    }
  }, [perijoveData]);

  return (
    <div className="container p-2">
      <LoadingPage enabled={loadingEnabled} text="Loading..." />
      <div className="grid grid-cols-4 gap-x-1.5">
        {perijoveData.map((perijove) => (
          <Card perijove={perijove} key={perijove.perijove} />
        ))}
      </div>
    </div>
  );
};

interface CardProps {
  perijove: PerijoveData;
}

const Card: FC<CardProps> = ({ perijove }) => {
  return (
    <Link
      className="min-w-52 min-h-52 bg-primary-200 bg-opacity-95 m-2 p-2 flex flex-col justify-center items-center bg-cover text-center bg-blend-overlay hover:bg-opacity-45 hover:bg-black cursor-pointer font-bold text-black hover:text-white"
      style={{ backgroundImage: `url('/PJs/PJimgs/PJ${perijove.perijove}/globe_mosaic.png')` }}
      to={`/perijove/${perijove.perijove}`}
    >
      <span className="w-full">PJ {perijove.perijove}</span>
      <span># of vortices: {perijove.num_vortices}</span>
    </Link>
  );
};

export default PerijoveSelector;