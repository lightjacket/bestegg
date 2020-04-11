import {gql, useQuery} from '@apollo/client';
import {EggPic} from "../components/eggpic";
import {Loader} from "../components/loader";
import * as React from "react";
import {Modal} from "../components/modal";
import {EggHeader} from "../components/eggheader";
import {useState} from "react";

const ALL_EGGS = gql`
    query AllEggs {
        allEggs {
            name
            id
            picIds
        }
    }
`;

const LIKES = gql`
    query Likes {
        likes {
            id
        }
    }
`;

const Egg = ({id, name, picIds, liked}) => {
    return <div className='m-2 p-2 border-r border-subtle pr-6'>
        <EggHeader id={id} name={name} liked={liked}/>
        <div><EggPic picId={picIds[0]} width={120}/></div>
        <div className='w-full'>{
            picIds.length > 1
                ? <Modal
                    placeholder={() => <span className='text-blue-500 underline'>See more</span>}
                    style={{height: '80%', top: '10%', left: '10%', width: '80%'}}
                >{({close}) => {
                    return <div className='flex flex-col h-full'>
                        <EggHeader id={id} name={name} liked={liked}/>
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
    const [filteredToLiked, setFilteredToLike] = useState(false);

    const {data, loading, error} = useQuery(ALL_EGGS);
    const {data: likesData, loading: likesLoading, error: likesError} = useQuery(LIKES);

    if (loading || !data || likesLoading || !likesData) return <div className='w-full'>
        <div className='w-32 mx-auto flex justify-around mt-32'><Loader/></div>
    </div>;

    const liked = (e) => !likesData ? false : likesData.likes.filter(i => i.id === e.id).length > 0;

    return <div>
        <div className='flex items-center'>
            <h1 className='text-2xl mr-5'>Vote</h1>
            <div>
                <input id='filter-starred' type='checkbox' className='mr-1' value={filteredToLiked}
                       onChange={() => setFilteredToLike(!filteredToLiked)}/>
                <label htmlFor='filter-starred'>Only show starred eggs</label>
            </div>
        </div>
        <div className='flex flex-wrap'>
            {data.allEggs.filter(e => !filteredToLiked || liked(e)).map(e => <Egg {...e} liked={liked(e)}/>)}
        </div>
    </div>;
};

export default Vote;
