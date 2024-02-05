export type WeatherForecast = {
  daily: {
    time: string[];
    temperature_2m_max: number[];
  };
  daily_units: {
    temperature_2m_max: string;
  };
};
