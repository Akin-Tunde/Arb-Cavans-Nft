// src/components/ActivityFeed.tsx

import { useActivityFeed } from '../hooks/useActivityFeed';
import type { ActivityItem } from '../hooks/useActivityFeed';

// A helper function to shorten addresses for display
const shortenAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

// A component to render a single item in the feed
const FeedItem: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const { type, details } = item;

  switch (type) {
    case 'Mint':
      return (
        <div className="text-sm">
          Pixel <span className="font-bold">{details.tokenId}</span> was minted by{' '}
          <span className="font-mono text-blue-600">{shortenAddress(details.to!)}</span>
        </div>
      );
    case 'Sale':
      return (
        <div className="text-sm">
          Pixel <span className="font-bold">{details.tokenId}</span> was sold to{' '}
          <span className="font-mono text-green-600">{shortenAddress(details.to!)}</span> for{' '}
          <span className="font-semibold">{details.price} ETH</span>
        </div>
      );
    case 'ColorChange':
      return (
        <div className="text-sm">
          Pixel <span className="font-bold">{details.tokenId}</span> color was changed by{' '}
          <span className="font-mono text-purple-600">{shortenAddress(details.from!)}</span>
        </div>
      );
    default:
      return null;
  }
};

export function ActivityFeed() {
  const { data: activities, isLoading, isError } = useActivityFeed();

  if (isLoading) {
    return <div className="p-4 text-center bg-white border rounded-lg shadow-sm">Loading activity...</div>;
  }

  if (isError || !activities) {
    return <div className="p-4 text-center bg-white border rounded-lg shadow-sm">Could not load activity feed.</div>;
  }
  
  if (activities.length === 0) {
     return (
        <div className="p-4 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Live Activity</h3>
            <p className="text-sm text-gray-500">No recent activity. Be the first to mint or trade a pixel!</p>
        </div>
     )
  }

  return (
    <div className="p-4 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Live Activity</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {activities.map(item => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}