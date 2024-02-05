import { FetchDataParams, typeahead } from './components/typeahead/typeahead';
import { weatherForecastComponent } from './components/weather-forecast/weather-forecast';
import { getAddress } from './helpers/address';
import { getWeatherForecast, getLocation } from './helpers/data';
import { addToCache, getFromCache } from './stores/input';
import './style.css';
import { Location } from './types/location';

function fetchData({ query }: FetchDataParams): Promise<Location[]> {
  return new Promise<Location[]>((resolve) => {
    if (query.length) {
      const fromCache = getFromCache(query) as Location[];
      if (fromCache) {
        resolve(fromCache);
        return;
      }

      getLocation(query).then((data) => {
        addToCache(query, data.results);
        resolve(data.results);
      });
    }
  });
}

function renderSearchItem(item: Location): string {
  return `
    <div class="dropdown__link__search_item" data-lat=${
      item.latitude
    } data-long=${item.longitude}>
      <div class="dropdown__link__search-item__text">
        <div class="dropdown__link__search_item__title">${item.name}</div>
        <div class="dropdown__link__search_item__subtitle">${getAddress(
          item
        )}</div>
      </div>
    </div>
  `;
}

function onItemClick(event: Event) {
  const { currentTarget } = event;
  const lat = (currentTarget as HTMLDivElement).dataset.lat;
  const long = (currentTarget as HTMLDivElement).dataset.long;
  if (lat && long) {
    getWeatherForecast(Number(lat), Number(long)).then((data) => {
      weatherForecastComponent({
        element: document.querySelector<HTMLDivElement>('#weather-forecast')!,
        data,
      });
    });
  }
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
  <div id="weather-forecast"></div>
`;

typeahead<Location>({
  element: document.querySelector<HTMLInputElement>('#search-field')!,
  fetchData,
  minQuery: 0,
  maxResults: 7,
  renderItem: renderSearchItem,
  onClick: onItemClick,
});
