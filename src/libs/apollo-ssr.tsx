import { ApolloClient, ObservableQuery, useApolloClient } from '@apollo/client';
import { getSuspenseCache } from '@apollo/client/react/cache';
import { InternalQueryReference } from '@apollo/client/react/cache/QueryReference';
import { SuspenseCache, SuspenseCacheOptions } from '@apollo/client/react/cache/SuspenseCache';
import { CacheKey } from '@apollo/client/react/cache/types';
import { ReactNode } from 'react';

export class SSRCache extends SuspenseCache {
  constructor(options: SuspenseCacheOptions = Object.create(null)) {
    super(options);
  }
  getQueryRef<TData = any>(cacheKey: CacheKey, createObservable: () => ObservableQuery<TData>) {
    const ref = super.getQueryRef(cacheKey, createObservable);
    this.refs.add(ref);
    return ref;
  }

  finished = false;
  refs = new Set<InternalQueryReference<any>>();
}

const DATA_NAME = '__NEXT_DATA_PROMISE__';

const DataRender = () => {
  const client = useApolloClient();
  const cache = getSuspenseCache(client);
  if (typeof window === 'undefined') {
    if (!(cache instanceof SSRCache)) {
      throw new Error('SSRCache missing.');
    }
    if (!cache.finished) {
      throw Promise.allSettled(Array.from(cache.refs.values()).map(({ promise }) => promise)).then(
        (v) => {
          cache.finished = true;
          return v;
        }
      );
    }
  }
  return (
    <script
      id={DATA_NAME}
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(client.extract()).replace(/</g, '\\u003c'),
      }}
    />
  );
};

export const initApolloCache = <T,>(
  client: ApolloClient<T> & {
    [suspenseCacheSymbol]?: SuspenseCache;
  }
) => {
  if (typeof window !== 'undefined') {
    const node = document.getElementById(DATA_NAME);
    if (node) client.restore(JSON.parse(node.innerHTML));
  } else {
    if (!client[suspenseCacheSymbol]) {
      client[suspenseCacheSymbol] = new SSRCache(client.defaultOptions.react?.suspense);
    }
  }
};

const suspenseCacheSymbol = Symbol.for('apollo.suspenseCache');

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
