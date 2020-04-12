import {gql, useMutation, useQuery} from '@apollo/client'
import {Loader, SmallLoader} from "../components/loader";
import * as React from "react";
import {EggPic} from "../components/eggpic";

const ALL_VOTES = gql`
    query AllVotes {
        allVotes {
            egg {
                name
                picIds
                movesOn
                id
            }
            likes
        }

        votingMode
    }
`;

const SET_MOVES_ON = gql`
    mutation SetMovesOn($eggId: ID!, $movesOn: Boolean!) {
        setMovesOn(eggId: $eggId, movesOn: $movesOn) {
            status
        }
    }
`;

const SET_ROUND = gql`
    mutation SetRound($round: String!) {
        setRound(round: $round) {
            status
        }
    }
`;

const Admin = () => {
    const {data, loading, error} = useQuery(ALL_VOTES);
    let mutationConfig = {
        refetchQueries: ['AllVotes'],
        awaitRefetchQueries: true
    };
    const [setMovesOn, {loading: saving}] = useMutation(SET_MOVES_ON, mutationConfig);
    const [setVotingMode, {loading: savingVotingMode}] = useMutation(SET_ROUND, mutationConfig);

    if (loading || !data) return <div className='w-full'>
        <div className='w-32 mx-auto flex justify-around mt-32'><Loader/></div>
    </div>;

    return <div>
        <h1 className='text-2xl mb-3'>All Votes</h1>
        <div className='mb-3'>
            <label>Round: </label>
            <select
                value={data.votingMode}
                className='p-1 border border-subtle rounded'
                onChange={(e) => setVotingMode({variables: {round: e.currentTarget.value}})}
            >
                <option value='round 1'>Round 1</option>
                <option value='round 2'>Round 2</option>
            </select>
        </div>
        <table className='w-full'>
            <tbody>
            <tr>
                <th className='text-left' colSpan={2}>Egg</th>
                <th className='text-left'>Votes</th>
                <th className='text-left'>Moves to round 2</th>
            </tr>
            {data.allVotes.slice().sort((a, b) => b.likes - a.likes).map(i => {
                const toggleMovesOn = async () => {
                    await setMovesOn({variables: {eggId: i.egg.id, movesOn: !i.egg.movesOn}})
                };

                return <tr className='border-t border-subtle'>
                    <td className='pr-2 pt-1'>{i.egg.name}</td>
                    <td className='pr-2 pl-2 pt-1'><EggPic picId={i.egg.picIds[0]} width={40}/></td>
                    <td className='pl-2 pl-2  pt-1'>{i.likes}</td>
                    <td className='pl-2 pt-1'>
                        <div className='flex h-full'>
                            <input checked={i.egg.movesOn} type='checkbox' onChange={toggleMovesOn}/>
                            {saving ? <SmallLoader/> : null}
                        </div>
                    </td>
                </tr>
            })}
            </tbody>
        </table>
    </div>;
};

export default Admin;
