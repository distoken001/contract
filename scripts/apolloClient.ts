// apolloClient.ts
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

const apolloConfig = {
  configServerUrl: 'http://97.74.86.12:8080',
  appId: '0001',
  clusterName: 'default',
  namespaceName: 'backend.share',
};

const apolloClient = new ApolloClient({
  link: createHttpLink({ uri: `${apolloConfig.configServerUrl}/configs/${apolloConfig.appId}/${apolloConfig.clusterName}/${apolloConfig.namespaceName}` }),
  cache: new InMemoryCache(),
});

export default apolloClient;