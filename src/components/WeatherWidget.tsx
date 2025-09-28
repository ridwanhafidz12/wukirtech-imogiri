import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "bcf1c39d83b539ab46e0638fb8e75840"; // 🔑 Ganti dengan API key OpenWeatherMap
        const lat = -7.9025; // Desa Wukirsari
        const lon = 110.3953;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`
        );
        const data = await response.json();

        setWeather({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main.toLowerCase(),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          description: data.weather[0].description, // deskripsi bahasa Indonesia
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("cloud")) return <Cloud className="w-8 h-8 text-gray-500" />;
    if (condition.includes("rain")) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (condition.includes("sun") || condition.includes("clear"))
      return <Sun className="w-8 h-8 text-yellow-500" />;
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cuaca Desa Wukirsari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cuaca Desa Wukirsari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Data cuaca tidak tersedia
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Thermometer className="w-5 h-5" />
          Cuaca Desa Wukirsari
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="text-2xl font-bold">{weather.temperature}°C</div>
              <div className="text-sm text-muted-foreground capitalize">
                {weather.description}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Kelembaban: {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Angin: {weather.windSpeed} km/h</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Wukirsari, Imogiri, Bantul, Yogyakarta
        </div>
      </CardContent>
    </Card>
  );
};
