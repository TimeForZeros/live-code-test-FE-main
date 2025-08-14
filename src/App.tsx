import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import FilterControls from './components/FilterControls';

const ReallyLargeComponent = lazy(() => import('./components/ReallyLargeComponent'));
const CountryTable = lazy(() => import('./components/CountryTable'));



const ErrorComponent = () => <div>An error occurred!</div>;



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
