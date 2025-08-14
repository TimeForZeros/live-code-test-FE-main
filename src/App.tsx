// @ts-nocheck
import { lazy, Suspense, useMemo, useCallback } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { create } from 'zustand';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Filter criteria
export type FilterCriteria = {
  searchTerm: string;
  minPopulation: number;
  selectedContinents: string[];
  showOnlyIndependent: boolean;
};

const useFilterStore = create<FilterCriteria>((set) => ({
  searchTerm: '',
  minPopulation: 0,
  selectedContinents: [],
  showOnlyIndependent: false,
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setMinPopulation: (minPopulation: number) => set({ minPopulation }),
  toggleContinent: (continent: string) =>
    set((state) => {
      const selectedContinents = state.selectedContinents.includes(continent)
        ? state.selectedContinents.filter((c) => c !== continent)
        : [...state.selectedContinents, continent];
      return { selectedContinents };
    }),
  toggleShowOnlyIndependent: () =>
    set((state) => ({ showOnlyIndependent: !state.showOnlyIndependent })),
}));

const ReallyLargeComponent = lazy(() => import('./components/ReallyLargeComponent'));
/* LIVE CODING CHALLENGE 
   
   TASKS:
   1. Fetch countries from the API endpoint below
   2. Handle loading, error states 
   3. Transform data: add populationDensity field (population/area, rounded to 2 decimals)
   4. Create filtering function that accepts countryData and returns filtered countries using the exampleFilterCriteria
   5. Map countries by continent, sort by density within each group (highest first)
   6. Display mapped countries with lazy loading for ReallyLargeComponent
   7. Add proper memoization (useMemo, useCallback)
   
   BONUS:
   - How would you retry if the API is down?
   - Create custom hook for data fetching
   - Error boundaries
   
   DISCUSSION:
   - How would you handle 10,000+ countries?
   - When would you add global state management?
*/

const API_ENDPOINT =
  'https://restcountries.com/v3.1/all?fields=name,population,area,capital,region,continents,flag,flags,independent,cca2';

// API response type
export type CountryApiResponse = {
  name: {
    common: string;
    official: string;
  };
  populationDensity?: number;
  population: number;
  area: number;
  capital?: string[];
  region: string;
  continents: string[];
  flag: string;
  flags: {
    png: string;
    svg: string;
  };
  independent?: boolean;
  cca2: string;
};

const exampleFilterCriteria: FilterCriteria = {
  searchTerm: 'Lit',
  minPopulation: 2794600,
  selectedContinents: ['Europe'],
  showOnlyIndependent: true,
};

const FilterControls = () => {
  const {
    searchTerm,
    minPopulation,
    selectedContinents,
    showOnlyIndependent,
    setSearchTerm,
    setMinPopulation,
    toggleContinent,
    toggleShowOnlyIndependent,
  } = useFilterStore();

  const continents = [
    'Africa',
    'Asia',
    'Europe',
    'North America',
    'South America',
    'Oceania',
    'Antarctica',
  ];

  return (
    <div className='p-4 bg-gray-100 rounded-lg shadow-inner flex flex-wrap gap-4 items-center justify-center'>
      <div className='flex items-center gap-2'>
        <label htmlFor='searchTerm' className='font-semibold text-gray-700'>
          Search:
        </label>
        <input
          id='searchTerm'
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='flex items-center gap-2'>
        <label htmlFor='minPopulation' className='font-semibold text-gray-700'>
          Min Population:
        </label>
        <input
          id='minPopulation'
          type='number'
          value={minPopulation}
          onChange={(e) => setMinPopulation(Number(e.target.value))}
          className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='flex flex-wrap gap-2'>
        <span className='font-semibold text-gray-700'>Continents:</span>
        {continents.map((continent) => (
          <label key={continent} className='flex items-center gap-1 cursor-pointer'>
            <input
              type='checkbox'
              checked={selectedContinents.includes(continent)}
              onChange={() => toggleContinent(continent)}
              className='form-checkbox text-blue-600'
            />
            {continent}
          </label>
        ))}
      </div>

      <div className='flex items-center gap-2'>
        <label
          htmlFor='showOnlyIndependent'
          className='flex items-center gap-1 font-semibold text-gray-700 cursor-pointer'>
          <input
            id='showOnlyIndependent'
            type='checkbox'
            checked={showOnlyIndependent}
            onChange={toggleShowOnlyIndependent}
            className='form-checkbox text-blue-600'
          />
          Show only Independent
        </label>
      </div>
    </div>
  );
};

const ErrorComponent = () => <div>An error occurred!</div>;

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

  const filterNameFn = (row: Row, columnId: string, filterValue: string) =>
    Object.values(country.name).some(
      (name) => typeof name === 'string' && name.includes(criteria.searchTerm),
    );

  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name.official', {
        header: 'Name',
        cell: (info) => info.getValue(),
        filterFn: filterNameFn,
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
    columnId,
    globalFilterValue: FilterCriteria,
  ) => {
    const country = row.original;
    const { searchTerm, minPopulation, selectedContinents, showOnlyIndependent } =
      globalFilterValue;

    const searchTermMatch =
      searchTerm === '' ||
      Object.values(country.name).some(
        (name) => typeof name === 'string' && name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const populationMatch = country.population >= minPopulation;

    const continentMatch =
      selectedContinents.length === 0 ||
      country.continents.some((continent) => selectedContinents.includes(continent));

    const independentMatch = !showOnlyIndependent || country.independent;

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

export default function App() {
  return (
    <div className='app-container'>
      <h1 className='text-3xl text-center'>Countries Population Dashboard</h1>
      <FilterControls />
      <div className='flex justify-center'>
        <ErrorBoundary FallbackComponent={ErrorComponent}>
          <Suspense fallback={'loading...'}>
            <div className='heavy-component-container'>
              <ReallyLargeComponent />
              <CountryTable />
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
