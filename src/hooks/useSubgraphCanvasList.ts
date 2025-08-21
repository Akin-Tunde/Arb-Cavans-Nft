// src/hooks/useSubgraphCanvasList.ts

import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { formatEther } from 'viem';

// This is the URL you provided from your Subgraph Studio dashboard.
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/119202/arb/version/latest';

// Define the interface for our canvas info. This ensures type safety
// and makes it compatible with the rest of our application.
export interface CanvasInfo {
  creator: `0x${string}`;
  canvasContract: `0x${string}`;
  nftContract: `0x${string}`;
  marketplaceContract: `0x${string}`;
  width: number;
  height: number;
  mintPrice: string;
}

// This GraphQL query is written to match the schema of your subgraph.
// It fetches all `canvasCreateds` events and orders them by when they were
// created, with the newest ones first.
const AllCanvasesQuery = gql`
  query GetCanvasCreatedEvents {
    canvasCreateds(orderBy: blockTimestamp, orderDirection: desc) {
      id
      creator
      canvasContract
      nftContract
      marketplaceContract
      width
      height
      initialMintPrice
    }
  }
`;

// This is our new custom hook.
export function useSubgraphCanvasList() {
  // useQuery is from @tanstack/react-query. It handles fetching, caching,
  // loading states, and error states for us.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['subgraphCanvasList'], // A unique key for this query
    async queryFn() {
      // 'request' sends the GraphQL query to our subgraph URL.
      const result = await request(SUBGRAPH_URL, AllCanvasesQuery) as {
        canvasCreateds: Array<{
          creator: `0x${string}`;
          canvasContract: `0x${string}`;
          nftContract: `0x${string}`;
          marketplaceContract: `0x${string}`;
          width: string;
          height: string;
           initialMintPrice: string;
        }>;
      };
      
      // We map the raw query result to the structured CanvasInfo[] type
      // that our application components expect.
      const canvases: CanvasInfo[] = result.canvasCreateds.map((event) => ({
        creator: event.creator,
        canvasContract: event.canvasContract,
        nftContract: event.nftContract,
        marketplaceContract: event.marketplaceContract,
        width: parseInt(event.width), // GraphQL returns BigInts as strings
        height: parseInt(event.height),
        mintPrice: formatEther(BigInt(event.initialMintPrice)),
      }));
      
      return canvases;
    }
  });

  return { 
    canvases: data ?? [], // Return the data, or an empty array if it's still loading
    isLoading: isLoading,
    isError: isError
  };
}