import { debounce } from '../../helpers/input';
import { getFromCache } from '../../stores/input';
import { dropdownMenu } from '../dropdown-menu/dropdown-menu';
import './typeahead.css';

export type RenderResultsParams<T> = {
  element: HTMLInputElement;
  data: T[];
  count?: number;
  labelBy?: keyof T;
  renderItem?: (fn: T) => string;
};

export type FetchDataParams = {
  query: string;
};

export type TypeaheadProps<T> = {
  element: HTMLInputElement;
  fetchData: (fn: FetchDataParams) => Promise<T[]>;
  renderItem?: (fn: T) => string;
  minQuery?: number;
  maxResults?: number;
};

function renderSearchResults<T>({
  element,
  data,
  count,
  renderItem,
}: RenderResultsParams<T>) {
  const resultsElement = document.createElement('div');
  resultsElement.classList.add('results-container');
  destroySearchResults(element);
  element.after(resultsElement);
  dropdownMenu<T>({
    element: resultsElement,
    input: element,
    data,
    count,
    renderItem,
  });
}

function destroySearchResults(element: HTMLInputElement) {
  if (element.nextSibling) {
    element.nextSibling.remove();
  }
}

export function typeahead<T>({
  element,
  fetchData,
  renderItem,
  minQuery = 3,
  maxResults = 10,
}: TypeaheadProps<T>) {
  element.addEventListener(
    'input',
    debounce(async () => {
      const query = element.value;
      if (element.value.length >= minQuery) {
        if (query.length) {
          const fromCache = getFromCache(query) as T[];
          if (fromCache) {
            renderSearchResults({
              element,
              data: fromCache,
              count: maxResults,
              renderItem,
            });
            return;
          }
          const data = (await fetchData({ query: element.value })) as T[];
          renderSearchResults({ element, data, count: maxResults, renderItem });
          return;
        }
        destroySearchResults(element);
      }
    })
  );

  element.addEventListener('focus', async () => {
    if (element.value.length >= minQuery) {
      const query = element.value;
      if (query.length) {
        const fromCache = getFromCache(query) as T[];
        if (fromCache) {
          renderSearchResults({
            element,
            data: fromCache,
            count: maxResults,
            renderItem,
          });
          return;
        }
        const data = (await fetchData({ query: element.value })) as T[];
        renderSearchResults({ element, data, count: maxResults, renderItem });
        return;
      }
      destroySearchResults(element);
    }
  });
}
