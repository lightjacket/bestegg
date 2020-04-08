import Head from 'next/head'
import {Upload} from "../components/cloudinary";

const AddEggs = () => {
    return <div>
        <Head>
            <title>Add Eggs</title>
        </Head>
        <h1>Add Eggs</h1>
        <Upload/>
    </div>
}

export default AddEggs
