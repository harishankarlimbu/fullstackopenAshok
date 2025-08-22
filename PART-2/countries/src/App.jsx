import { useEffect, useState } from "react"

function App() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const filtered = data.filter((item) =>
    item.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const countryToShow = country || (filtered.length === 1 ? filtered[0] : null)

  useEffect(() => {
    if (!countryToShow || !countryToShow.capital) return

    const api_key = import.meta.env.VITE_WEATHER_KEY
    const capital = Array.isArray(countryToShow.capital)
      ? countryToShow.capital[0]
      : countryToShow.capital

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("Weather fetch error:", err))
  }, [countryToShow])

  useEffect(() => {
    async function APICALL() {
      const res = await fetch(
        "https://studies.cs.helsinki.fi/restcountries/api/all"
      )
      const result = await res.json()
      setData(result)
    }
    APICALL()
  }, [])

  const showDetails = (country) => {
    setCountry(country)
  }

  return (
    <div>
      <p>search for countries</p>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />

      {filtered.length > 10 && <p>Too many matches, specify another filter</p>}

      {filtered.length <= 10 && filtered.length > 1 && (
        <ul>
          {filtered.map((country) => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => showDetails(country)}>show</button>
            </li>
          ))}
        </ul>
      )}

      {countryToShow && (
        <div>
          <h2>{countryToShow.name.common}</h2>
          <p>Capital: {countryToShow.capital?.[0] || "N/A"}</p>
          <p>Area: {countryToShow.area}</p>

          <h3>LANGUAGES:</h3>
          <ul>
            {countryToShow.languages
              ? Object.values(countryToShow.languages).map((lang, idx) => (
                <li key={lang + idx}>{lang}</li>
              ))
              : <li>No languages listed</li>}
          </ul>

          <img src={countryToShow.flags.png} alt="flag" width="120" />
        </div>
      )}

      {weather && countryToShow && (
        <div>
          <h3>Weather in {countryToShow.capital?.[0]}</h3>
          <p>Temperature: {weather.main?.temp} °C</p>
          <p>{weather.weather?.[0]?.description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}

          />
          <p>Wind Speed: {weather.wind?.speed} m/s</p>
          <p>Humidity: {weather.main?.humidity} %</p>
          <p>Pressure: {weather.main?.pressure} hPa</p>
        </div>
      )}
    </div>
  )
}

export default App
