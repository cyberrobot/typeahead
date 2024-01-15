import { debounce } from '../../helpers/input';
import { getFromCache } from '../../stores/input';
import './typeahead.css';

export type RenderResultsParams<T> = {
  element: HTMLInputElement;
  data: T[];
  count?: number;
  labelBy?: keyof T;
};

export type FetchDataParams = {
  query: string;
};

export function typeahead<T>(
  element: HTMLInputElement,
  fetchData: (fn: FetchDataParams) => Promise<T[]>,
  renderResults: (fn: RenderResultsParams<T>) => void,
  minQuery = 3,
  maxResults = 10
) {
  element.addEventListener(
    'input',
    debounce(async () => {
      const query = element.value;
      if (element.value.length >= minQuery) {
        if (query.length) {
          const fromCache = getFromCache(query) as T[];
          if (fromCache) {
            renderResults({ element, data: fromCache, count: maxResults });
            return;
          }
          const data = (await fetchData({ query: element.value })) as T[];
          renderResults({ element, data, count: maxResults });
        }
      }
    })
  );

  element.addEventListener('focus', async () => {
    if (element.value.length >= minQuery) {
      const query = element.value;
      if (query.length) {
        const fromCache = getFromCache(query) as T[];
        if (fromCache) {
          renderResults({ element, data: fromCache, count: maxResults });
          return;
        }
        const data = (await fetchData({ query: element.value })) as T[];
        renderResults({ element, data, count: maxResults });
      }
    }
  });
}
