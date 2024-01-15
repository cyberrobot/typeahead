import {
  FetchDataParams,
  RenderResultsParams,
  typeahead,
} from './components/typeahead/typeahead';
import { dropdownMenu } from './components/dropdown-menu/dropdown-menu';
import { personSearch } from './helpers/data';
import { addToCache, getFromCache } from './stores/input';
import './style.css';
import { Person } from './types/person';

function showSearchResults({
  element,
  data,
  count,
}: RenderResultsParams<Person>) {
  const resultsElement = document.createElement('div');
  resultsElement.classList.add('results-container');
  if (element.nextSibling) {
    element.nextSibling.remove();
  }
  element.after(resultsElement);
  dropdownMenu<Person>({
    element: resultsElement,
    input: element,
    data,
    count,
  });
}

function fetchData({ query }: FetchDataParams): Promise<Person[]> {
  return new Promise<Person[]>((resolve) => {
    if (query.length) {
      const fromCache = getFromCache(query) as Person[];
      if (fromCache) {
        resolve(fromCache);
        return;
      }

      personSearch(query).then((data) => {
        addToCache(query, data.results);
        resolve(data.results);
      });
    }
  });
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="typeahead">
    <?xml version="1.0" encoding="iso-8859-1"?>
    <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
      viewBox="0 0 490.4 490.4" xml:space="preserve">
    <g>
      <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796
        s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z
        M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"/>
    </g>
    </svg>
    <input id="search-field" type="text" placeholder="Search" />
  </div>
`;

typeahead<Person>(
  document.querySelector<HTMLInputElement>('#search-field')!,
  fetchData,
  showSearchResults,
  0
);
