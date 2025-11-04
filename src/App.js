import { useState, useEffect } from 'react';  
import './App.css';

function App() {
  const [weatherList, setWeatherList] = useState([]);
  const[newCity, setNewCity] = useState("");
  const[searchTerm, setSearchTerm] = useState("");
  const[error, setError] = useState(null);

  const handleSearch = () => {
    if (!newCity.trim()) return;

    if(
      weatherList.some(
        (city) => city.name.toLowerCase() === newCity.trim().toLowerCase()
      )
    ) {
      setError("Bu şehir zaten listede.");
      return;
    }
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=1af986e6ee60d12c67f9142da9062e7c&units=metric&lang=tr`
    )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 404|| !data.name) {
        setError("Şehir bulunamadı.");
        return;
      } 
      if (data.name.toLowerCase() !== newCity.trim().toLowerCase()) {
  setError("Lütfen şehir adını tam yazın.");
  return;
}
        setWeatherList((prev) => [...prev, data]);
        setError(null);
      })
      .catch(() => setError("Bağlantı hatası"));
    
   
    setNewCity("");
  }

  useEffect(() => {
    const savedWeather= localStorage.getItem("weatherList");
    if (savedWeather) {
      setWeatherList (JSON.parse (savedWeather));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("weatherList", JSON.stringify(weatherList));
  }, [weatherList]);

  useEffect(() => {
    const cities = ["Istanbul", "Ankara", "Izmir"];

    Promise.all(
      cities.map((cityName) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=1af986e6ee60d12c67f9142da9062e7c&units=metric&lang=tr`
        ).then((response) => response.json())
      )
    ).then((dataList) => {
      setWeatherList(dataList); 
    });
  }, []); 

  return (
    <div
  className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start p-6"
  style={{ backgroundImage: "url('/background.jpg')" }}
>


     <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-6 text-center animate-pulse">

      Hava Durumu Uygulaması
      </h1>
      <input
       type="text"
        placeholder="Şehir Ara..."
        value={newCity}
        onChange={(e) => setNewCity(e.target.value)}
         onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
  }}
        className="border border-gray-300 rounded-lg p-2 w-64 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSearch}
       className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
       
       Ara
     </button>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
  {weatherList.map((cityData, index) => (
    <div
  key={index}
  className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-4 text-center hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-out animate-fadeIn"
>


      <h2 className="text-xl font-semibold text-gray-700">{cityData.name}</h2>
      <p className="text-gray-500">{cityData.weather?.[0]?.description}</p>
      <p className="text-2xl font-bold text-blue-600 mt-2">
        {cityData.main?.temp}°C
      </p>
    </div>
  ))}
</div>
    </div>
  );
}

export default App;
