import React from 'react'
import App from 'next/app'
import '../css/tailwind.css'
import '../css/fonts.css'
import Link from "next/link";
import {Auth0Provider, useAuth0} from "../components/auth0";
import {GraphQLProvider} from "../components/graphql";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import {CloudinaryContext} from "../components/cloudinary";

const InnerApp = ({Component, pageProps}) => {
    const {user, login, loading, logout} = useAuth0();

    return <>
        <div className='border-b border-subtle flex p-2 justify-between'>
            <div className='flex'>
                <span className='mr-6 font-extrabold text-xl mt-auto'><Link href='/'>Best Egg</Link></span>
                <span className='mr-4 mt-auto'><Link href='/addeggs'>My Eggs</Link></span>
                <span className='mr-4 mt-auto'><Link href='/vote'>Vote</Link></span>
            </div>
            <div className='flex'>
                {!user
                    ? <div className='mr-6 font-extrabold mt-auto'>
                        {loading
                            ? null
                            : <button onClick={login}>Login</button>
                        }
                    </div>
                    : <div className='mr-6 font-extrabold mt-auto'>
                        {loading
                            ? null
                            : <button onClick={logout}>Logout</button>
                        }
                    </div>
                }
            </div>
        </div>
        <div className='p-3'>
            <Component {...pageProps} />
        </div>
    </>
};

class MyApp extends App {
    render() {
        return <CloudinaryContext>
            <Auth0Provider>
                <GraphQLProvider>
                    <InnerApp {...this.props}/>
                </GraphQLProvider>
            </Auth0Provider>
        </CloudinaryContext>;
    }
}

export default MyApp
