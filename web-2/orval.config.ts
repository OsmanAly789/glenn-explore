import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://0.0.0.0:5001/api/swagger/v1/swagger.json',
      validation: false,
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/custom-client.ts',
          name: 'customClient'
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'page',
          options: {
            staleTime: 10000,
          },
        },
      },
    },
  },
});
