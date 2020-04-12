import Head from 'next/head'
import {Upload} from "../components/cloudinary";
import {gql, useMutation, useQuery} from "@apollo/client";
import * as React from "react";
import {useState} from "react";
import {Loader, SmallLoader} from "../components/loader";
import {EggPic} from "../components/eggpic";
import {Modal} from "../components/modal";

const MY_EGGS = gql`
    query MyEggs {
        myEggs {
            name
            picIds
            id
        }
    }
`;

const ADD_PIC = gql`
    mutation AddPic($eggId: String!, $picId: String!) {
        addEggPic(eggPicId: $picId, eggId: $eggId) {
            status
        }
    }
`;

const DELETE_EGG = gql`
    mutation DeleteEgg($eggId: ID!) {
        deleteEgg(eggId: $eggId) {
            status
        }
    }
`;

const DeleteEgg = ({id}) => {
    const [deleteEgg, {loading: saving}] = useMutation(DELETE_EGG, {
        variables: {eggId: id},
        refetchQueries: ['MyEggs'],
        awaitRefetchQueries: true
    });

    return <Modal placeholder={() => {
        return <div className='rounded p-2 bg-red-600 text-white ml-2'>Delete Egg</div>
    }}>{({close}) => {
        return <div>
            <div className='mb-4'>Are you sure you want to delete this egg?</div>
            <div className='flex justify-end'>
                {saving ? <SmallLoader/> : null}
                <button className='p-2 px-5 rounded text-white bg-red-600' onClick={async () => {
                    await deleteEgg();
                    close();
                }}>
                    Yes
                </button>
                <button className='p-2 rounded border border-subtle rounded ml-2' onClick={close}>Cancel</button>
            </div>
        </div>
    }}
    </Modal>;
};

const Egg = ({name, picIds, id}) => {
    const [addPic, {loading: saving}] = useMutation(ADD_PIC, {
        refetchQueries: ['MyEggs'],
        awaitRefetchQueries: true
    });

    return <div className='border-subtle border-b pb-2 mb-2 mt-2'>
        <div className='flex justify-between w-full'>
            <h3 className='mr-2 text-lg'>{name}</h3>
            <div className='flex relative'>
                {saving ? <SmallLoader/> : null}
                <Upload onUpload={(i) => addPic({variables: {picId: i, eggId: id}})}>
                    <div className='border border-subtle rounded p-2'>Add a pic</div>
                </Upload>
                <DeleteEgg id={id}/>
            </div>
        </div>
        <div className='flex flex-wrap'>
            {picIds.map(i => <EggPic picId={i} className='pr-2'/>)}
        </div>
    </div>
};

const EggList = () => {
    const {data, loading, error} = useQuery(MY_EGGS);

    if (loading || !data) return <div className='w-full'>
        <div className='w-32 mx-auto flex justify-around mt-32'><Loader/></div>
    </div>;

    return data.myEggs.map(e => <Egg {...e}/>);
};

const AddEggs = () => {
    return <div>
        <Head>
            <title>Add Eggs</title>
        </Head>
        <div className='flex w-full border-b border-subtle pb-2'>
            <h1 className='text-2xl mr-3 pb-2'>My Eggs</h1>
            <NewEgg/>
        </div>
        <EggList/>
    </div>
};

const ADD_EGG = gql`
    mutation AddEgg($name: String!, $picIds: [String!]!) {
        addEgg(name: $name, picIds: $picIds) {
            id
        }
    }
`;

const NewEgg = () => {
    const [addEgg, {loading: saving}] = useMutation(ADD_EGG, {
        refetchQueries: ['MyEggs'],
        awaitRefetchQueries: true
    });
    const [name, setName] = useState('');
    const [picIds, setPicIds] = useState([]);

    const addPicId = (id) => setPicIds([id, ...picIds]);

    return <Modal placeholder={() => <div className='p-2 border border-subtle p-2 rounded'>Add egg</div>}>{({close}) =>
        <div className='p-1 h-full flex flex-col'>
            <table className='w-full'>
                <tbody>
                <tr>
                    <td><label htmlFor='egg-name'>Name: </label></td>
                    <td className='pl-1'>
                        <input
                            id='egg-name'
                            value={name}
                            onChange={e => setName(e.currentTarget.value)}
                            className='border border-subtle rule p-2 rounded w-full'
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <div className='flex-grow flex mt-2'>
                {picIds.map(i => <EggPic picId={i} className='pr-2' width={80}/>)}
            </div>
            <div className='p-1 flex justify-end'>
                {saving ? <SmallLoader/> : null}
                <Upload onUpload={(id) => addPicId(id)}>
                    <div className='border border-subtle rounded p-2 mx-1'>Add a pic</div>
                </Upload>
                <div>
                    <button
                        className='p-2 border border-subtle rounded disabled:opacity-50'
                        onClick={async () => {
                            await addEgg({variables: {name, picIds}});
                            close();
                        }}
                        disabled={picIds.length === 0}
                    >
                        Add egg
                    </button>
                </div>
            </div>
        </div>}
    </Modal>;
};

export default AddEggs
