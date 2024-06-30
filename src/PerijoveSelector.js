import vorticesdata from './media/vortices.json';

export default function PerijoveSelector({}) {
    const perijove_data = [...Array(23).keys()].map((num) => {
        const perijove = num + 13;
        const num_vortices = vorticesdata.filter((vortex) => (vortex.perijove == perijove)).length;
        return {
            'perijove': perijove,
            'num_vortices': num_vortices,
        }
    });

    return (
        <div className='container p-2'>
            <div className="grid grid-cols-4 gap-x-1.5">
                {perijove_data.map((perijove) => (<Card perijove={perijove} key={perijove.perijove}/>))}
            </div>
        </div>
    )
};

const Card = ({ perijove }) => {
    return (
        <a className='min-w-52 bg-primary-300 m-2 p-2 flex flex-col text-center hover:bg-primary-500 cursor-pointer text-black hover:text-black' href={'/perijove/' + perijove.perijove}>
            <span className="w-full">PJ {perijove.perijove}</span>
            <span># of vortices: {perijove.num_vortices}</span>
        </a>
    )
};