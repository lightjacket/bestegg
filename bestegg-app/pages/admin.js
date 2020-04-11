import {gql, useQuery} from '@apollo/client'
import {Loader} from "../components/loader";
import * as React from "react";
import {EggPic} from "../components/eggpic";

const ALL_VOTES = gql`
    query AllVotes {
        allVotes {
            egg {
                name
                picIds
            }
            likes
        }
    }
`;

const Admin = () => {
    const {data, loading, error} = useQuery(ALL_VOTES);

    if (loading || !data) return <div className='w-full'>
        <div className='w-32 mx-auto flex justify-around mt-32'><Loader/></div>
    </div>;

    console.log('data', data);

    return <div>
        <h1 className='text-2xl mb-3'>All Votes</h1>
        <table className='w-full'>
            <tbody>
            <tr>
                <th className='text-left' colSpan={2}>Egg</th>
                <th className='text-left'>Votes</th>
            </tr>
            {data.allVotes.sort((a, b) => b.likes - a.likes).map(i => <tr className='border-t border-subtle'>
                <td className='pr-2 pt-1'>{i.egg.name}</td>
                <td className='pr-2 pl-2 pt-1'><EggPic picId={i.egg.picIds[0]} width={40}/></td>
                <td className='pl-2 pt-1'>{i.likes}</td>
            </tr>)}
            </tbody>
        </table>
    </div>;
};

export default Admin;
