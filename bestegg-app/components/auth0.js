import React, {Component, createContext, useContext, useEffect, useState} from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';

// create the context
export const Auth0Context = createContext();

// create a provider
export const Auth0Provider = ({children}) => {
    const [auth0Client, setAuth0Client] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        (async () => {
            const config = {
                domain: process.env.NEXT_AUTH0_DOMAIN,
                client_id: process.env.NEXT_AUTH0_CLIENT_ID,
                redirect_uri: window.location.origin
            };

            const auth0Client = await createAuth0Client(config);
            setAuth0Client(auth0Client);

            if (window.location.search.includes('code=')) {
                await auth0Client.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            const isAuthenticated = await auth0Client.isAuthenticated();
            setIsAuthenticated(isAuthenticated);
            const user = isAuthenticated ? await auth0Client.getUser() : null;
            setUser(user);

            if (isAuthenticated) {
                try {
                    setToken(await auth0Client.getTokenSilently({
                        audience: process.env.NEXT_AUDIENCE,
                        scope: 'admin'
                    }));
                } catch (e) {
                    if (e.error === 'consent_required') {
                        setToken(await auth0Client.getTokenWithPopup({
                            audience: process.env.NEXT_AUDIENCE,
                            scope: 'admin'
                        }));
                    }
                }
            } else {
                await auth0Client.loginWithRedirect();
            }

            setLoading(false);
        })()
    }, []);

    return (
        <Auth0Context.Provider value={{
            isAuthenticated,
            user,
            loading,
            token,
            loginWithRedirect: (...p) => auth0Client && auth0Client.loginWithRedirect(...p),
            getTokenSilently: (...p) => auth0Client && auth0Client.getTokenSilently(...p),
            getIdTokenClaims: (...p) => auth0Client && auth0Client.getIdTokenClaims(...p),
            logout: (...p) => auth0Client && auth0Client.logout(...p)
        }}>
            {children}
        </Auth0Context.Provider>
    );
};

export const useAuth0 = () => {
    const auth0 = useContext(Auth0Context);

    if (!auth0) {
        throw new Error('Cannot use useAuth0 outside of an Auth0Provider');
    }

    return {
        login: () => auth0.loginWithRedirect(),
        logout: () => auth0.logout(),
        loading: auth0.loading,
        user: auth0.user,
        token: auth0.token
    }
};
