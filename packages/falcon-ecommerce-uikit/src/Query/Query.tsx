import React from 'react';
import { Query as ApolloQuery, OperationVariables, QueryProps as ApolloQueryProps, QueryResult } from 'react-apollo';
import { NetworkStatus, ApolloError } from 'apollo-client';
import { Loader } from './Loader';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ApolloFetchMore<TData, TVariables> = QueryResult<TData, TVariables>['fetchMore'];
export type FetchMore<TData, TVariables> = (data: TData, fetchMore: ApolloFetchMore<TData, TVariables>) => any;

export type QueryRenderProps<TData> = TData & { networkStatus: NetworkStatus; fetchMore: (() => any) | undefined };

export type QueryProps<TData, TVariables> = Omit<ApolloQueryProps<TData, TVariables>, 'children'> & {
  children: (result: QueryRenderProps<TData>) => React.ReactNode;
  fetchMore?: FetchMore<TData, TVariables>;
};

export class Query<TData = any, TVariables = OperationVariables> extends React.Component<
  QueryProps<TData, TVariables>
> {
  static propTypes = {
    ...ApolloQuery.propTypes
  };

  getErrorCode(error?: ApolloError): string | undefined {
    if (error) {
      const { graphQLErrors } = error;
      if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
        const { extensions = {} } = graphQLErrors[0];
        const { code } = extensions;

        return code;
      }
    }

    return undefined;
  }

  render() {
    const { children, fetchMore, ...restProps } = this.props;

    return (
      <ApolloQuery {...restProps}>
        {({ networkStatus, error, data, loading, fetchMore: apolloFetchMore }) => {
          if (error) {
            const errorCode = this.getErrorCode(error);
            // TODO: check errorPolicy and if === 'all' then pass thru render props all extracted/formated errors with errorcodes instead of inline error message
            return (
              <p>
                {`Error!: ${errorCode}`}
                <br /> {`${error}`}
              </p>
            );
          }

          if (networkStatus === NetworkStatus.loading || (networkStatus !== NetworkStatus.fetchMore && loading)) {
            return <Loader />;
          }

          return children({
            ...data!,
            networkStatus,
            fetchMore: fetchMore ? () => fetchMore(data!, apolloFetchMore) : undefined
          });
        }}
      </ApolloQuery>
    );
  }
}

export type ShopPageQuery = {
  aggregations?: string[];
  page?: number;
  perPage?: number;
};

export type Pagination = {
  totalPages: number;
  totalItems: number;
  perPage: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
};
