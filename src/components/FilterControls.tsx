import { useFilterStore } from "@/store/filterStore";

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

export default FilterControls;
