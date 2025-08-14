import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FilterState, useFilterStore } from '@/store/filterStore';
import type { CountryApiResponse } from '@/types';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type FilterFn,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const API_ENDPOINT =
  'https://restcountries.com/v3.1/all?fields=name,population,area,capital,region,continents,flag,flags,independent,cca2';

const CountryTable = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await fetch(API_ENDPOINT);
      if (!res.ok) throw new Error('Fetch failed!');
      return res.json();
    },
    retry: 3,
    retryDelay: (attempt) => 100 * Math.max(2, attempt),
  });

  const filterCriteria = useFilterStore();

  // const exampleFilterCriteria: FilterCriteria = {
  //   searchTerm: 'Lit',
  //   minPopulation: 2794600,
  //   selectedContinents: ['Europe'],
  //   showOnlyIndependent: true,
  // };

  const columnHelper = createColumnHelper<CountryApiResponse>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name.official', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('population', {
        header: 'Population',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('populationDensity', {
        header: 'Density',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('continents', {
        header: 'Continents',
        cell: (info) => {
          const cellData = info.getValue() as string[];
          return cellData.join(', ');
        },
      }),
      columnHelper.accessor('flag', {
        header: 'Flag',
        cell: (info) => info.getValue(),
      }),
    ],
    [],
  );

  const globalFilterFn: FilterFn<CountryApiResponse> = (
    row,
    _columnId,
    filterValue: FilterState,
  ) => {
    const country = row.original;
    const { searchTerm, minPopulation, selectedContinents, showOnlyIndependent } = filterValue;

    const searchTermMatch =
      searchTerm === '' ||
      Object.values(country.name).some(
        (name) => typeof name === 'string' && name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const populationMatch = country.population >= minPopulation;

    const continentMatch =
      selectedContinents.length === 0 ||
      country.continents.some((continent) => selectedContinents.includes(continent));

    const independentMatch = !showOnlyIndependent || !!country.independent;

    return searchTermMatch && populationMatch && continentMatch && independentMatch;
  };

  const continentData = useMemo(() => {
    const continentalMap: Record<string, CountryApiResponse[]> = {};
    data
      .map((country: CountryApiResponse) => {
        country.populationDensity = Math.round((country.population / country.area) * 100) / 100;
        return country;
      })
      .forEach((country: CountryApiResponse) =>
        country.continents.forEach((continent: string) => {
          if (!continentalMap[continent]) {
            continentalMap[continent] = [country];
            return;
          }
          continentalMap[continent].push(country);
        }),
      );
    Object.values(continentalMap).forEach((countries: CountryApiResponse[]) =>
      countries.sort((a, b) => b.populationDensity! - a.populationDensity!),
    );
    return continentalMap;
  }, [data]);

  console.log('*** Continent Data***');
  console.dir(continentData);
  console.log('*** Filtered Countries');
  // console.dir(filterCountries(data, exampleFilterCriteria));

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filterCriteria,
    },
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CountryTable;
