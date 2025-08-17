import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import FilterControls from './components/FilterControls';
import { Card, CardContent, CardTitle, CardHeader } from './components/ui/card';

const ReallyLargeComponent = lazy(() => import('./components/ReallyLargeComponent'));
const CountryTable = lazy(() => import('./components/CountryTable'));

const ErrorComponent = () => <div>An error occurred!</div>;

export default function App() {
  return (
    <div className='h-screen flex align-middle'>
      <Card className='app-container max-w-[64rem] mx-auto my-auto'>
        <CardHeader>
          <CardTitle className='text-3xl text-center'>Countries Population Dashboard</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <FilterControls />
          <ErrorBoundary FallbackComponent={ErrorComponent}>
            <Suspense fallback={'loading...'}>
              <div className='heavy-component-container hidden'>
                <ReallyLargeComponent />
              </div>
              <CountryTable />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
