import * as React from 'react';
import {ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache} from "@apollo/client";
import {useAuth0} from "./auth0";

export const GraphQLProvider = ({children}) => {
    const {token} = useAuth0();

    if (typeof fetch !== 'undefined') {
        const middlewareLink = new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            return forward(operation);
        });

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: middlewareLink.concat(new HttpLink({
                uri: '/api/graphql',
            }))
        });
        return <ApolloProvider client={client}>{children}</ApolloProvider>;
    } else {
        return children;
    }
};
