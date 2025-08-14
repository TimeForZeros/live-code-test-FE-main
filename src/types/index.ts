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
