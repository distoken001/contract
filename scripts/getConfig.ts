// getConfig.ts
import { gql } from 'apollo-boost';
import apolloClient from './apolloClient';

export async function getConfigValue(paramName: string): Promise<string | number> {
  const query = gql`
    query getConfigValue($paramName: String!) {
      configValue(name: $paramName)
    }
  `;

  const { data } = await apolloClient.query({ query, variables: { paramName } });
  return data.configValue;
}
