# next-apollo-ssr

Next.js で`@apollo/client@3.8.0`の useSuspenseQuery を使って SSR をするサンプル

本来 useSuspenseQuery は StreamingSSR を前提としていますが、必要なデータが出揃ったところでレンダリングされるようにしています。

- デモ
  <https://next-apollo-ssr-six.vercel.app/>
