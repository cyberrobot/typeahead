import { FetchDataParams, typeahead } from './components/typeahead/typeahead';
import { personSearch } from './helpers/data';
import { addToCache, getFromCache } from './stores/input';
import './style.css';
import { Person } from './types/person';

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

function renderSearchItem(item: Person): string {
  const placeholder = `
    <svg class="typeahead__avatar" fill="#000000" xmlns="http://www.w3.org/2000/svg"  width="100" height="100"
      viewBox="0 0 100 100" xml:space="preserve">
    
    <g>
      <g>
        <path d="M80,71.2V74c0,3.3-2.7,6-6,6H26c-3.3,0-6-2.7-6-6v-2.8c0-7.3,8.5-11.7,16.5-15.2c0.3-0.1,0.5-0.2,0.8-0.4
          c0.6-0.3,1.3-0.3,1.9,0.1C42.4,57.8,46.1,59,50,59c3.9,0,7.6-1.2,10.8-3.2c0.6-0.4,1.3-0.4,1.9-0.1c0.3,0.1,0.5,0.2,0.8,0.4
          C71.5,59.5,80,63.9,80,71.2z"/>
      </g>
      <g>
        <ellipse cx="50" cy="36.5" rx="14.9" ry="16.5"/>
      </g>
    </g>
    </svg>
  `;
  const avatar = item.profile_path
    ? `<img src="https://image.tmdb.org/t/p/w180_and_h180_face${item.profile_path}" />`
    : placeholder;
  const knownFor = item.known_for
    .filter((item) => item.title)
    .map((item) => item.title)
    .join(', ');
  return `
    <div class="dropdown__link__search_item">
    <div class="typeahead__avatar__container">${avatar}</div>
      <div class="dropdown__link__search-item__text">
        <div class="dropdown__link__search_item__title">${item.name}</div>
        <div class="dropdown__link__search_item__subtitle">${knownFor}</div>
      </div>
    </div>
  `;
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="typeahead">
    <?xml version="1.0" encoding="iso-8859-1"?>
    <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg class="typeahead__search_icon" fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
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

typeahead<Person>({
  element: document.querySelector<HTMLInputElement>('#search-field')!,
  fetchData,
  minQuery: 0,
  maxResults: 7,
  renderItem: renderSearchItem,
});
