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
  onClick?: (event: Event) => void;
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
  onClick?: (event: Event) => void;
};

function renderSearchResults<T>({
  element,
  data,
  count,
  renderItem,
  onClick,
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
    onClick,
  });
}

function destroySearchResults(element: HTMLInputElement) {
  if (element.nextSibling) {
    element.nextSibling.remove();
  }
}

async function onHandle<T>({
  element,
  minQuery,
  maxResults,
  renderItem,
  fetchData,
  onClick,
}: TypeaheadProps<T>) {
  if (minQuery != undefined && element.value.length >= minQuery) {
    const query = element.value;
    if (query.length) {
      let data = getFromCache(query) as T[];
      if (!data) {
        data = (await fetchData({ query: element.value })) as T[];
      }
      renderSearchResults({
        element,
        data,
        count: maxResults,
        renderItem,
        onClick,
      });
      return;
    }
    destroySearchResults(element);
  }
}

export function typeahead<T>({
  element,
  fetchData,
  renderItem,
  minQuery = 3,
  maxResults = 10,
  onClick,
}: TypeaheadProps<T>) {
  element.addEventListener(
    'input',
    debounce(
      async () =>
        await onHandle<T>({
          element,
          minQuery,
          maxResults,
          fetchData,
          renderItem,
          onClick,
        })
    )
  );

  element.addEventListener(
    'focus',
    async () =>
      await onHandle<T>({
        element,
        minQuery,
        maxResults,
        fetchData,
        renderItem,
        onClick,
      })
  );
}
