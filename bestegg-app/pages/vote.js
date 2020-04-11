import {gql, useQuery} from '@apollo/client';
import {EggPic} from "../components/eggpic";
import {Loader} from "../components/loader";
import * as React from "react";
import {Modal} from "../components/modal";

const ALL_EGGS = gql`
    query AllEggs {
        allEggs {
            name
            id
            picIds
        }
    }
`;

const Egg = ({id, name, picIds}) => {
    return <div className='m-2 p-2 border-r border-subtle pr-6'>
        <h3 className='text-lg'>{name.length === 0 ? 'Unnamed' : name}</h3>
        <div><EggPic picId={picIds[0]} width={120}/></div>
        <div className='w-full'>{
            picIds.length > 1
                ? <Modal
                    placeholder={() => <span className='text-blue-500 underline'>See more</span>}
                    style={{height: '70%'}}
                >{({close}) => {
                    return <div className='flex flex-col h-full'>
                        <h3 className='text-2xl'>{name.length === 0 ? 'Unnamed' : name}</h3>
                        <div className='flex flex-wrap flex-grow overflow-y-scroll min-h-0'>
                            {picIds.map(i => <EggPic key={i} picId={i} width={180}/>)}
                        </div>
                    </div>
                }}</Modal>
                : null
        }</div>
    </div>
};

const Vote = () => {
    const {data, loading, error} = useQuery(ALL_EGGS);

    if (loading || !data) return <div className='w-full'>
        <div className='w-32 mx-auto flex justify-around mt-32'><Loader/></div>
    </div>;

    return <div>
        <h1 className='text-2xl'>Vote</h1>
        <div className='flex flex-wrap'>
            {data.allEggs.map(e => <Egg {...e}/>)}
        </div>
    </div>;
};

export default Vote;
