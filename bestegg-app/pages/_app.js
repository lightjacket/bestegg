import React from 'react'
import App from 'next/app'
import '../css/tailwind.css'
import '../css/fonts.css'
import Head from "next/head";
import Link from "next/link";
import {Auth0Provider, useAuth0} from "../components/auth0";
import {GraphQLProvider} from "../components/graphql";

const InnerApp = ({Component, pageProps}) => {
    const {user, login, loading, token} = useAuth0();
    console.log('user', user, 'token', token);

    return <>
        <div className='border-b border-subtle flex p-2 justify-between'>
            <div className='flex'>
                <span className='mr-6 font-extrabold text-xl mt-auto'><Link href='/'>Best Egg</Link></span>
                <span className='mr-4 mt-auto'><Link href='/addeggs'>Add Eggs</Link></span>
                <span className='mr-4 mt-auto'><Link href='/vote'>Vote</Link></span>
            </div>
            <div className='flex'>
                <div className='mr-6 font-extrabold text-xl mt-auto'>
                    {loading ? null : <button onClick={login}>
                        Login
                    </button>}
                </div>
                <span className='mr-4 mt-auto'><Link href='/addeggs'>Add Eggs</Link></span>
            </div>
        </div>
        <Component {...pageProps} />
    </>
}

class MyApp extends App {
    render() {
        return <Auth0Provider><GraphQLProvider><InnerApp {...this.props}/></GraphQLProvider></Auth0Provider>;
    }
}

export default MyApp
