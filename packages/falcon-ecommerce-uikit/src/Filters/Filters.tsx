import React from 'react';
import { T } from '@deity/falcon-i18n';
import { Box, Button, H3, themed } from '@deity/falcon-ui';
import { SearchConsumer, Aggregation, FilterData, FilterOperator } from '../Search';
import { FilterTile, FilterLayout } from './FilterTile';
import { FilterContent, SingleFilter } from './FilterContent';
import { FiltersSummary } from './FiltersSummary';

export const aggregationToFilterData = (aggregation: Aggregation, operator: FilterOperator = 'eq'): FilterData => ({
  field: aggregation.field,
  title: aggregation.title,
  type: aggregation.type,
  operator,
  options: aggregation.buckets
});

export const getFiltersData = (aggregations: Aggregation[], mergeWith: FilterData[] = []): FilterData[] =>
  [...[], ...aggregations.map(x => aggregationToFilterData(x)), ...mergeWith].sort((first, second) =>
    first.title < second.title ? -1 : 1
  );

export const FiltersLayout = themed({
  tag: Box,
  defaultTheme: {
    filtersPanelLayout: {
      display: 'grid',
      gridGap: 'sm'
    }
  }
});

export const Filters: React.SFC<{ data: FilterData[] }> = ({ data }) => (
  <SearchConsumer>
    {({ setFilter, removeFilter, removeAllFilters, state: { filters } }) => {
      const anyFilters = filters.length > 0;

      return (
        <FiltersLayout>
          {anyFilters && (
            <Button onClick={removeAllFilters}>
              <T id="filters.clearAll" />
            </Button>
          )}
          {anyFilters && <FiltersSummary data={data} />}
          {data.map(item => {
            const selectedFilter = filters.find(x => x.field === item.field);

            if (item.field === 'color') {
              return (
                <FilterLayout key={item.field}>
                  <H3>{item.title}</H3>
                  <SingleFilter
                    field={item.field}
                    options={item.options}
                    selected={selectedFilter ? selectedFilter.value[0] : undefined}
                    setFilter={setFilter}
                    removeFilter={removeFilter}
                  />
                </FilterLayout>
              );
            }

            return (
              <FilterLayout key={item.field}>
                <H3>{item.title}</H3>
                <FilterContent
                  singleMode={item.field === 'cat'}
                  aggregation={item}
                  selected={selectedFilter ? selectedFilter.value : []}
                  setFilter={setFilter}
                  removeFilter={removeFilter}
                />
              </FilterLayout>
            );
          })}
        </FiltersLayout>
      );
    }}
  </SearchConsumer>
);