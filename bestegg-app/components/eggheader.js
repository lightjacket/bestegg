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

export const EggHeader = ({name, id, liked}) => {
    let likeConfig = {
        variables: {eggId: id},
        refetchQueries: ['Likes'],
        awaitRefetchQueries: true
    };
    const [likeEgg, {loading: savingLike}] = useMutation(LIKE, likeConfig);
    const [unlikeEgg, {loading: savingUnlike}] = useMutation(UNLIKE, likeConfig);

    return <div className='flex'>
        <h3 className='text-lg mr-1'>{name.length === 0 ? 'Unnamed' : name}</h3>
        <button onClick={() => liked ? unlikeEgg() : likeEgg()}>
            <i className={`${liked ? 'fas' : 'far'} fa-star text-yellow-600`}/>
        </button>
        <div className='h-full overflow-visible'>
            {savingLike || savingUnlike ? <Loader size={14}/> : null}
        </div>
    </div>
};
