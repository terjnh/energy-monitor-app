import { fetcher } from '@/lib/fetch';
import useSWRInfinite from 'swr/infinite';

export function usePostDevice({ creatorId, limit = 10 } = {}) {
    const { data, error, size, ...props } = useSWRInfinite(
        (index, previousPageData) => {
          // reached the end
          if (previousPageData && previousPageData.devices.length === 0) return null;
    
          const searchParams = new URLSearchParams();
          searchParams.set('limit', limit);
    
          if (creatorId) searchParams.set('by', creatorId);
    
          if (index !== 0) {
            // using oldest devices createdAt date as cursor
            // We want to fetch devices which has a date that is
            // before (hence the .getTime()) the last post's createdAt
            const before = new Date(
              new Date(
                previousPageData.devices[previousPageData.devices.length - 1].createdAt
              ).getTime()
            );
    
            searchParams.set('before', before.toJSON());
          }
    
          return `/api/devices?${searchParams.toString()}`;
        },
        fetcher,
        {
          refreshInterval: 1000 * 60 * 5, // 5mins
          revalidateAll: false,
        }
      );
    
      const isLoadingInitialData = !data && !error;
      const isLoadingMore =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === 'undefined');
      const isEmpty = data?.[0]?.length === 0;
      const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.devices?.length < limit);
    
      return {
        data,
        error,
        size,
        isLoadingMore,
        isReachingEnd,
        ...props,
      }; 
}