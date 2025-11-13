const BASE_URL = "https://api.openweathermap.org/data/2.5";

function kelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

export async function getWeatherByPincode(pincode) {
  if (!process.env.OPENWEATHER_API_KEY) {
    console.warn("OPENWEATHER_API_KEY is not configured.");
    return null;
  }

  const params = new URLSearchParams({
    zip: `${pincode},IN`,
    appid: process.env.OPENWEATHER_API_KEY,
  });

  const res = await fetch(`${BASE_URL}/weather?${params.toString()}`, {
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    console.error("Weather API error", await res.text());
    return null;
  }

  const data = await res.json();
  return {
    location: data.name,
    temperature: kelvinToCelsius(data.main?.temp),
    humidity: data.main?.humidity,
    description: data.weather?.[0]?.description,
  };
}

export async function getForecastByPincode(pincode) {
  if (!process.env.OPENWEATHER_API_KEY) {
    return [];
  }

  const params = new URLSearchParams({
    zip: `${pincode},IN`,
    appid: process.env.OPENWEATHER_API_KEY,
    cnt: 40,
  });

  const res = await fetch(`${BASE_URL}/forecast?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Forecast API error", await res.text());
    return [];
  }

  const data = await res.json();
  // Group 3-hourly forecasts by day
  const dailyForecasts = {};
  (data.list || []).forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split("T")[0];
    if (!dailyForecasts[dayKey]) {
      dailyForecasts[dayKey] = {
        date: dayKey,
        rainfall: 0,
        tempDay: kelvinToCelsius(item.main?.temp),
        tempNight: kelvinToCelsius(item.main?.temp),
        description: item.weather?.[0]?.description,
      };
    }
    // Accumulate rainfall
    if (item.rain && item.rain["3h"]) {
      dailyForecasts[dayKey].rainfall += item.rain["3h"];
    }
    // Update max/min temps
    const temp = kelvinToCelsius(item.main?.temp);
    if (temp > dailyForecasts[dayKey].tempDay) {
      dailyForecasts[dayKey].tempDay = temp;
    }
    if (temp < dailyForecasts[dayKey].tempNight) {
      dailyForecasts[dayKey].tempNight = temp;
    }
  });

  return Object.values(dailyForecasts).slice(0, 7);
}

