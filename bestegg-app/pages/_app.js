import React from 'react'
import App from 'next/app'
import '../css/tailwind.css'
import '../css/fonts.css'
import Head from "next/head";
import Link from "next/link";

class MyApp extends App {
    render() {
        const {Component, pageProps} = this.props;
        return <>
            <div className='border-b border-subtle flex p-2'>
                <span className='mr-6 font-extrabold text-xl mt-auto'><Link href='/'>Best Egg</Link></span>
                <span className='mr-4 mt-auto'><Link href='/addeggs'>Add Eggs</Link></span>
                <span className='mr-4 mt-auto'><Link href='/vote'>Vote</Link></span>
            </div>
            <Component {...pageProps} />
        </>
    }
}

export default MyApp
