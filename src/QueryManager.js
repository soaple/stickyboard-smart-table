// src/QueryManager.js

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

var apolloClient = null;

const runQuery = async (query) => {
    if (!apolloClient) {
        throw new Error("ApolloClient didn't initialized.");
    }

    const result = await apolloClient.query({
        query: gql`
            ${query}
        `,
    });

    // Extract result data from the result
    const resultData = Object.values(result.data)[0];

    return resultData;
};

const runMutation = async (mutation, refetchQuery) => {
    if (!apolloClient) {
        throw new Error("ApolloClient didn't initialized.");
    }

    const result = await apolloClient.mutate({
        mutation: gql`
            ${mutation}
        `,
        refetchQueries: [{
            query: gql`
                ${refetchQuery}
            `,
        }]
    });

    console.log(result);

    // Extract result data from the result
    const resultData = Object.values(result.data)[0];

    return resultData;
};

const QueryManager = {
    initialize: (endpoint) => {
        apolloClient = new ApolloClient({
            uri: endpoint,
            cache: new InMemoryCache({
                addTypename: false,
            }),
        });

        return apolloClient;
    },

    query: async (query) => {
        return await runQuery(query);
    },

    mutate: async (mutation, refetchQuery) => {
        return await runMutation(mutation, refetchQuery);
    }
};

export default QueryManager;
