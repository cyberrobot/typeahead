import { getLocalDate } from '../../helpers/date';
import { toInt } from '../../helpers/number';
import { WeatherForecast } from '../../types/weather-forecast';
import './weather-forecast.css';

type WeatherForecastProps = {
  data: WeatherForecast;
  element: HTMLDivElement;
};

export const weatherForecastComponent = ({
  element,
  data,
}: WeatherForecastProps) => {
  if (!data) {
    element.innerHTML = '';
    return;
  }

  element.innerHTML = `
    <div class="weather_forecast__container">
          ${data.daily.time
            .map(
              (time, index) => `
              <div class="weather_forecast__item">
                <div class="weather_forecast__item__time">${getLocalDate(
                  time
                )}</div>
                <div class="weather_forecast__item__temperature">
                  ${toInt(data.daily.temperature_2m_max[index])}${
                data.daily_units.temperature_2m_max
              }
                </div>
              </div>
          `
            )
            .join('')}
    </div>
  `;
};
