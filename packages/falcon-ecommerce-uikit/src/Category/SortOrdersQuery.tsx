import gql from 'graphql-tag';
import { Query } from '../Query/Query';

export const SORT_ORDERS_QUERY = gql`
  query SortOrdersQuery {
    sortOrders @client
  }
`;

export type SortOrderDirection = 'asc' | 'desc';

export type SortOrder = {
  field: string;
  direction: SortOrderDirection;
  name: string;
};

export type SortOrdersData = {
  sortOrders: SortOrder[];
};

export class SortOrdersQuery extends Query<SortOrdersData> {
  static defaultProps = {
    query: SORT_ORDERS_QUERY
  };
}