import {
  ApolloClient,
  DocumentNode,
  getApolloContext,
  ObservableQuery,
  OperationVariables,
  SuspenseCache,
  TypedDocumentNode,
  useApolloClient,
} from '@apollo/client';
import { ReactNode, useContext } from 'react';

export class SSRCache extends SuspenseCache {
  add<TData = any, TVariables extends OperationVariables = OperationVariables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    variables: TVariables | undefined,
    {
      promise,
      observable,
    }: {
      promise: Promise<any>;
      observable: ObservableQuery<TData, TVariables>;
    }
  ) {
    this.promises.add(promise);
    return super.add(query, variables, { promise, observable });
  }
  finished = false;
  promises = new Set<Promise<unknown>>();
}

const DATA_NAME = '__NEXT_DATA_PROMISE__';

const DataRender = () => {
  const client = useApolloClient();
  const context = useContext(getApolloContext());
  const cache = context.suspenseCache;
  if (!(cache instanceof SSRCache)) {
    throw new Error('SSRCache missing.');
  }
  if (
    typeof window === 'undefined' &&
    !cache.finished &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    throw Promise.all(cache.promises).then((v) => {
      cache.finished = true;
      return v;
    });
  }
  return (
    <script
      id={DATA_NAME}
      type="application/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(client.extract()) }}
    />
  );
};

export const initApolloCache = <T,>(clinet: ApolloClient<T>) => {
  if (typeof window !== 'undefined') {
    const node = document.getElementById(DATA_NAME);
    if (node) clinet.restore(JSON.parse(node.innerHTML));
  }
};

export const SSRProvider = ({ children }: { children: ReactNode }) => {
  const client = useApolloClient();
  initApolloCache(client);
  return (
    <>
      {children}
      <DataRender />
    </>
  );
};
