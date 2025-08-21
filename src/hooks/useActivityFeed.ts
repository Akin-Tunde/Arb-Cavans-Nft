// src/hooks/useActivityFeed.ts

import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { formatEther } from 'viem';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/11922/arb/version/latest';

// This interface represents a single, combined item in our feed.
export interface ActivityItem {
  id: string;
  type: 'Mint' | 'Sale' | 'ColorChange';
  timestamp: number;
  // A flexible 'details' object holds the unique info for each event type
  details: {
    canvasContract?: `0x${string}`;
    tokenId?: string;
    from?: `0x${string}`; // seller or color changer
    to?: `0x${string}`;   // buyer or minter
    price?: string;
    colorIndex?: number;
  };
}

// This advanced GraphQL query uses 'aliases' (e.g., mints: pixelMinteds)
// to query three different entities in a single network request.
const ActivityFeedQuery = gql`
  query GetActivityFeed {
    mints: pixelMinteds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      blockTimestamp
      tokenId
      minter
    }
    sales: pixelSolds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      blockTimestamp
      tokenId
      seller
      buyer
      price
    }
    colorChanges: colorChangeds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      blockTimestamp
      tokenId
      owner
    }
  }
`;

export function useActivityFeed() {
  return useQuery({
    queryKey: ['activityFeed'],
    // Refetch every 15 seconds to keep the feed fresh
    refetchInterval: 15000, 
    async queryFn(): Promise<ActivityItem[]> {
      const data = await request(SUBGRAPH_URL, ActivityFeedQuery) as any;

      // 1. Map each event type to our standard ActivityItem format
      const mappedMints: ActivityItem[] = data.mints.map((e: any) => ({
        id: e.id,
        type: 'Mint',
        timestamp: parseInt(e.blockTimestamp),
        details: { tokenId: e.tokenId, to: e.minter },
      }));

      const mappedSales: ActivityItem[] = data.sales.map((e: any) => ({
        id: e.id,
        type: 'Sale',
        timestamp: parseInt(e.blockTimestamp),
        details: {
          tokenId: e.tokenId,
          from: e.seller,
          to: e.buyer,
          price: formatEther(e.price), // Format the price for display
        },
      }));

      const mappedChanges: ActivityItem[] = data.colorChanges.map((e: any) => ({
        id: e.id,
        type: 'ColorChange',
        timestamp: parseInt(e.blockTimestamp),
        details: { tokenId: e.tokenId, from: e.owner },
      }));

      // 2. Combine all events into one array
      const combined = [...mappedMints, ...mappedSales, ...mappedChanges];

      // 3. Sort the combined array by timestamp to ensure it's chronological
      const sorted = combined.sort((a, b) => b.timestamp - a.timestamp);

      return sorted;
    },
  });
}