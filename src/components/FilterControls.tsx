import { useFilterStore } from '@/store/filterStore';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { DialogHeader } from './ui/dialog';

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
    // <div className='p-6 max-w-xl mx-auto rounded-xl shadow-lg bg-white'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Open Filter Settings</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Country Filters</DialogTitle>
          </DialogHeader>

          <div className='space-y-6 py-4'>
            <div className='flex flex-col space-y-2'>
              <Label htmlFor='searchTerm'>Search</Label>
              <Input
                id='searchTerm'
                type='text'
                placeholder="e.g. 'United States'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex flex-col space-y-2'>
              <Label htmlFor='minPopulation'>Min Population</Label>
              <Input
                id='minPopulation'
                type='text'
                placeholder='e.g. 1000000'
                value={minPopulation || ''}
                onChange={(e) => {
                  const numVal = Number(e.target.value);
                  if (Number.isNaN(numVal)) return;
                  setMinPopulation(numVal);
                }}
              />
            </div>

            <div>
              <Label className='text-base mb-2 block'>Continents</Label>
              <p className='text-sm text-muted-foreground mb-4'>
                Select the continents you want to include.
              </p>
              <div className='flex flex-col space-y-2'>
                {continents.map((continent) => (
                  <div key={continent} className='flex flex-row items-start space-x-3 space-y-0'>
                    <Checkbox
                      id={`continent-${continent}`}
                      checked={selectedContinents.includes(continent)}
                      onCheckedChange={() => toggleContinent(continent)}
                    />
                    <Label htmlFor={`continent-${continent}`} className='font-normal'>
                      {continent}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <Checkbox
                id='showOnlyIndependent'
                checked={showOnlyIndependent}
                onCheckedChange={toggleShowOnlyIndependent}
              />
              <div className='space-y-1 leading-none'>
                <Label htmlFor='showOnlyIndependent'>Show only Independent countries</Label>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    // </div>
  );
};

export default FilterControls;
