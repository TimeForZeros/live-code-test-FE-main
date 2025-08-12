import { lazy, Suspense, useMemo, useCallback } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
// mailto:brynner.doyle@aiq.com

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

// Filter criteria
export type FilterCriteria = {
  searchTerm: string;
  minPopulation: number;
  selectedContinents: string[];
  showOnlyIndependent: boolean;
};

const exampleFilterCriteria: FilterCriteria = {
  searchTerm: 'Lit',
  minPopulation: 2794600,
  selectedContinents: ['Europe'],
  showOnlyIndependent: true,
};

const CountryList = () => {
  // TODO: State for countries data, loading, error
  // TODO: Fetch data from API_ENDPOINT with retry logic
  // TODO: Create filterCountries(countries, criteria) function
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

  const filterCountries = useCallback(
    (coutnries: CountryApiResponse[], criteria: FilterCriteria) => {
      const nameMatch = (country: CountryApiResponse) =>
        Object.values(country.name).some(
          (name) => typeof name === 'string' && name.includes(criteria.searchTerm),
        );
      const continentMatch = (country: CountryApiResponse) =>
        country.continents.some((continent: string) =>
          criteria.selectedContinents.includes(continent),
        );
      return coutnries.filter((country: CountryApiResponse) => {
        if (!nameMatch(country)) return;
        if (!continentMatch(country)) return;
        if (country.population < criteria.minPopulation) return;
        if (country.independent !== criteria.showOnlyIndependent) return;
        return true;
      });
    },
    [data],
  );

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

  return (
    <>
      {Object.entries(continentData).map(
        ([continent, countries]: [string, CountryApiResponse[]]) => (
          <div>
            <h2>{continent}</h2>
            <ul>
              {countries.map((country) => (
                <li>{country.name.official}</li>
              ))}
            </ul>
          </div>
        ),
      )}
    </>
  );
};
const ErrorComponent = () => <div>
  An error occurred!
</div>

export default function App() {
  return (
    <div className='app-container'>
      <h1>Countries Population Dashboard</h1>
      <ErrorBoundary FallbackComponent={ErrorComponent}>
        <Suspense fallback={'loading...'}>
          {/* TODO: Show loading/error states */}
          <div className='heavy-component-container'>
            {/* TODO: Prevent component from blocking page load */}
            <ReallyLargeComponent />
            <CountryList />
          </div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
