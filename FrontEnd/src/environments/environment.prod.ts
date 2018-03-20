import { DataProviderFactory, RestDataProvider } from 'radweb';

const serverUrl= '/';
export const environment = {
  production: true,
  serverUrl,
  dataSource : new RestDataProvider(serverUrl+ 'dataapi') as DataProviderFactory
};
