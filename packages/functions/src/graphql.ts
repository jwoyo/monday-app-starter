import {GraphQLClient} from 'graphql-request';
import {getSdk} from 'monday-client/sdk';

export const buildMondayGraphQLClientOnBehalfOfUser = (authorization: string) => getSdk(new GraphQLClient('https://api.monday.com/v2', {headers: {authorization}}));
