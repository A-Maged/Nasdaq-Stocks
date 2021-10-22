import { useInfiniteQuery } from 'react-query';
import { AxiosError } from 'axios';
import { QueryFunction, QueryKey } from 'react-query';
import { useToast } from '@chakra-ui/react';

import {
  TickerApiError,
  TickerListApiResponse,
  PolygonTickerRepo,
  TickerListQuery,
} from 'api/repos/TickerRepo';

export function useGetTickers(query: Omit<TickerListQuery, 'url'>) {
  const toast = useToast();

  return useInfiniteQuery<TickerListApiResponse, AxiosError<TickerApiError>>(
    'tickers',
    makeFetchTickers(query),
    {
      getNextPageParam: (apiResponse) => apiResponse?.next_url,
      refetchOnMount: false,
      onError: (error) => {
        toast({
          title: error?.response?.data.error,
          status: 'warning',
          isClosable: true,
          position: 'bottom-right',
        });
      },
    }
  );
}

const polygonTickerRepo = new PolygonTickerRepo();

const makeFetchTickers: MakeFetchTickers =
  (query) =>
  ({ pageParam: nextUrl }) => {
    return polygonTickerRepo.list({ url: nextUrl, ...query });
  };

type MakeFetchTickers = (
  query: Omit<TickerListQuery, 'url'>
) => QueryFunction<TickerListApiResponse, QueryKey>;
