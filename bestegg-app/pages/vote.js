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
            movesOn
        }

        votingMode
    }
`;

const LIKES = gql`
    query Likes {
        likes {
            egg {
                id
            }
            rank
        }
    }
`;

const Egg = ({id, name, picIds, liked, votingMode, remainingRanks, rank}) => {
    const Header = () => {
        return <EggHeader
            id={id}
            name={name}
            liked={liked}
            ranked={votingMode === 'round 2'}
            unusedRanks={remainingRanks}
            rank={rank}
        />
    };

    return <div className='m-2 p-2 border-r border-subtle pr-6'>
        <Header/>
        <div><EggPic picId={picIds[0]} width={120}/></div>
        <div className='w-full'>{
            picIds.length > 1
                ? <Modal
                    placeholder={() => <span className='text-blue-500 underline'>See more</span>}
                    style={{height: '80%', top: '10%', left: '10%', width: '80%'}}
                >{({close}) => {
                    return <div className='flex flex-col h-full'>
                        <Header/>
                        <div className='flex flex-wrap flex-grow overflow-y-scroll min-h-0'>
                            {picIds.map(i => <EggPic key={i} picId={i} width={180}/>)}
                        </div>
                    </div>
                }}</Modal>
                : null
        }</div>
    </div>
};

let NUM_VOTES = 10;

const Vote = () => {
    const [filteredToLiked, setFilteredToLike] = useState(false);

    const {data, loading, error} = useQuery(ALL_EGGS);
    const {data: likesData, loading: likesLoading, error: likesError} = useQuery(LIKES);

    if (loading || !data || likesLoading || !likesData) return <div className='w-full'>
        <div className='w-32 mx-auto flex justify-around mt-32'><Loader/></div>
    </div>;

    const liked = (e) => !likesData ? false : likesData.likes.filter(i => i.egg.id === e.id).length > 0;
    const rank = (e) => !likesData ? false : likesData.likes
        .filter(i => i.egg.id === e.id && i.rank)
        .reduce((acc, i) => acc || i.rank, null);

    const numLiked = data.allEggs.filter(e => liked(e)).length;
    const usedRanks = likesData
        ? likesData.likes.filter(i => i.rank).reduce((acc, i) => [...acc, i.rank], [])
        : [];
    const remainingRanks = [1, 2, 3].filter(i => usedRanks.indexOf(i) === -1);

    return <div>
        <div className='flex items-end align-baseline'>
            <h1 className='text-2xl mr-5 py-0'>Vote</h1>
            <div className={'border-subtle border-r pr-2 mr-2 ' + (numLiked > NUM_VOTES ? 'text-red-500' : '')}>
                {numLiked} of 10 votes used
            </div>
            <div>
                <input id='filter-starred' type='checkbox' className='mr-1' checked={filteredToLiked}
                       onChange={() => setFilteredToLike(!filteredToLiked)}/>
                <label htmlFor='filter-starred'>Only show eggs you've voted for</label>
            </div>
        </div>
        <div className='flex flex-wrap'>
            {data.allEggs
                .filter(e => !filteredToLiked || liked(e))
                .filter(i => {
                    return data.votingMode !== 'round 2' || i.movesOn
                }).map(e => (
                    <Egg {...e} rank={rank(e)} votingMode={data.votingMode} liked={liked(e)}
                         remainingRanks={remainingRanks}/>
                ))}
        </div>
    </div>;
};

export default Vote;
