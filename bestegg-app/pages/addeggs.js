import Head from 'next/head'
import {Upload} from "../components/cloudinary";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useState} from "react";
import {Loader, SmallLoader} from "../components/loader";
import * as React from 'react';
import {Image} from 'cloudinary-react';

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

const Egg = ({name, picIds, id}) => {
    console.log('id', id);

    const [addPic, {loading: saving}] = useMutation(ADD_PIC, {
        refetchQueries: ['MyEggs'],
        awaitRefetchQueries: true
    });

    return <div className='border-subtle border-b pb-2 mb-2 mt-2'>
        <div className='flex justify-between w-full'>
            <h3 className='mr-2 text-lg'>{name}</h3>
            <div className='flex'>
                {saving ? <SmallLoader/> : null}
                <Upload onUpload={(i) => addPic({variables: {picId: i, eggId: id}})}>
                    <div className='border border-subtle rounded p-2'>Add a pic</div>
                </Upload>
            </div>
        </div>
        <div className='flex'>
            {picIds.map(i => {
                return <img
                    className='pr-2'
                    src={`https://res.cloudinary.com/do8cebkqd/image/upload/c_thumb,w_200,g_face/v1586394745/${i}.jpg`}
                />
            })}
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

const Modal = ({placeholder, children}) => {
    const [open, setOpen] = useState(false);
    const C = placeholder;

    if (!open) return <button onClick={() => setOpen(!open)}><C/></button>;
    return <div className='fixed top-0 left-0 w-full h-full'>
        <div className='opacity-50 bg-black w-full h-full' onClick={() => setOpen(false)}/>
        <div className='absolute opacity-100 bg-white p-2 w-1/2 rounded flex flex-col'
             style={{left: '50%', top: '50%', marginLeft: '-25%', marginTop: '-35%', height: '70%'}}>
            <div className='h-4 text-right'>
                <button onClick={() => setOpen(false)}>
                    <i className='fas fa-times'/>
                </button>
            </div>
            <div className='flex-grow'>
                {children({close: () => setOpen(false)})}
            </div>
        </div>
    </div>;
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

    console.log('pic ids', picIds);

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
            <div className='flex-grow'>
                {picIds.map(i => <Image publicId={i.id} width={100}/>)}
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
