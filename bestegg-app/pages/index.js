import Head from 'next/head'
import {useAuth0} from "../components/auth0";
import {useQuery, gql} from "@apollo/client";

const HELLO = gql`
    { hello }
`;

const Inner = () => {
    const info = useQuery(HELLO);
    console.log('info', info);
    return <div></div>;
};

const Home = () => {
    const {token} = useAuth0();

    if(!token) return <div>Loading...</div>;

    return <div>
        <Head>
            <title>Best Egg</title>
        </Head>
        <Inner/>
    </div>
};

export default Home
