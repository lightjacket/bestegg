import Head from 'next/head';
import {useRouter} from "next/router";
import {useEffect} from "react";

const Home = () => {
    const router = useRouter();
    useEffect(() => router.push('/addeggs'), []);

    return <div>
        <Head>
            <title>Best Egg</title>
        </Head>
    </div>
};

export default Home
