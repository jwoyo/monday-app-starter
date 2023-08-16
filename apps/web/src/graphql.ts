import {GraphQLClient, RequestDocument, Variables, resolveRequestDocument, RequestOptions} from 'graphql-request';
import {getSdk} from 'monday-client/sdk';
import monday from 'monday-sdk-js';
import {VariablesAndRequestHeadersArgs, GraphQLClientRequestHeaders} from 'graphql-request/internal-types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore (type definition is not exported)
import {TypedDocumentNode} from '@graphql-typed-document-node/core';

/**
 * returns typed graphql monday client. relies on code generation from monday-client workspace
 * @returns monday client
 */
export const useMondayClient = () => {
  return getSdk(new MondayPostMessageApiClient());
};

/**
 * This class is a workaround for the fact that the monday-sdk-js communicates with the graphql api via the parent frame using postMessages.
 * therefore we need to use the monday-sdk-js api to make graphql requests.
 */
class MondayPostMessageApiClient extends GraphQLClient {
  constructor() {
    super('');
  }

  /**
   * this method is called by the graphql-request library to make a request to the graphql api. we use the monday-sdk-js api to make the request.
   * @param {TypedDocumentNode} document the graphql document
   * @param {VariablesAndRequestHeadersArgs<value>} variablesAndRequestHeaders the variables and request headers
   * @return {Promise<unknown>} the response from the graphql api
   */
  async request<T, V extends Variables = Variables>(
      document: TypedDocumentNode,
      ...variablesAndRequestHeaders: VariablesAndRequestHeadersArgs<V>
  ): Promise<T> {
    const [variables, requestHeaders] = variablesAndRequestHeaders;
    // copied from parent class
    const parseRequestArgs = <V extends Variables = Variables>(
      documentOrOptions: RequestDocument | RequestOptions<V>,
      variables?: V,
      requestHeaders?: GraphQLClientRequestHeaders
    ): RequestOptions<V> =>
          (documentOrOptions as RequestOptions<V>).document ?
              (documentOrOptions as RequestOptions<V>) :
              ({
                document: documentOrOptions as RequestDocument,
                variables: variables,
                requestHeaders: requestHeaders,
                signal: undefined,
              } as unknown as RequestOptions<V>);
    const requestOptions = parseRequestArgs(document, variables, requestHeaders);
    const {query} = resolveRequestDocument(requestOptions.document);
    const response = await monday().api(query, {variables});
    return response.data as T;
  }
}
