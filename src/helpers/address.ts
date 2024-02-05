import { Location } from '../types/location';

export const getAddress = (location: Location) => {
  const result = [];
  for (const key in location) {
    if (
      location.hasOwnProperty(key) &&
      /admin\d+$/.test(key) &&
      location[key as keyof Location] !== ''
    ) {
      result.push(location[key as keyof Location]);
    }
  }
  return result.join(', ');
};
