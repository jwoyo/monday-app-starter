import {GraphQLClient} from 'graphql-request';
import {getSdk} from 'monday-client/sdk';

/**
 * builds a monday.com GraphQL client that uses the given authorization header. utilizes the generated code from the monday-client workspace
 * @param authorization
 * @return {Sdk} The GraphQL client.
 */
export const buildMondayGraphQLClientOnBehalfOfUser = (authorization: string) => getSdk(new GraphQLClient('https://api.monday.com/v2', {headers: {authorization}}));
