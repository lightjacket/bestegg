import {gql, useMutation} from "@apollo/client";
import {Loader} from "./loader";
import * as React from "react";

const LIKE = gql`
    mutation Like($eggId: ID!) {
        likeEgg(eggId: $eggId) {
            status
        }
    }
`;

const UNLIKE = gql`
    mutation UnLike($eggId: ID!) {
        unlikeEgg(eggId: $eggId) {
            status
        }
    }
`;

const SET_RANK = gql`
    mutation SetRank($eggId: ID!, $rank: Int) {
        setRank(eggId: $eggId, rank: $rank) {
            status
        }
    }
`;

export const EggHeader = ({name, id, liked, ranked, unusedRanks, rank}) => {
    let likeConfig = {
        variables: {eggId: id},
        refetchQueries: ['Likes'],
        awaitRefetchQueries: true
    };
    const [likeEgg, {loading: savingLike}] = useMutation(LIKE, likeConfig);
    const [unlikeEgg, {loading: savingUnlike}] = useMutation(UNLIKE, likeConfig);
    const [setRank, {loading: savingRank}] = useMutation(SET_RANK, likeConfig);

    return <div className='flex'>
        <h3 className='text-lg mr-1'>{name.length === 0 ? 'Unnamed' : name}</h3>
        {ranked
            ? <select value={rank || '-'} onChange={async (e) => {
                await setRank({
                    variables: {
                        eggId: id,
                        rank: e.currentTarget.value === '-' ? null : parseInt(e.currentTarget.value)
                    }
                })
            }}>
                <option value={'-'}>---</option>
                {[...unusedRanks, ...(rank ? [rank] : [])].map(r => <option value={r} key={r}>{r}</option>)}
            </select>
            : <button onClick={() => liked ? unlikeEgg() : likeEgg()}>
                <i className={`${liked ? 'fas' : 'far'} fa-star text-yellow-600`}/>
            </button>}
        <div className='h-full overflow-visible'>
            {savingLike || savingUnlike || savingRank ? <Loader size={14}/> : null}
        </div>
    </div>
};
