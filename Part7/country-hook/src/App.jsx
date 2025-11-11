import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (!name) {
      setCountry(null);
      return;
    }
    //lowercasing and trimming the name
    const encodedName = encodeURIComponent(name.toLowerCase().trim());
    axios
      .get(
        `https://studies.cs.helsinki.fi/restcountries/api/name/${encodedName}`
      )
      .then((response) => {
        const countryData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (!countryData) {
          console.log('No country data found in response');
          setCountry({
            found: false,
          });
          return;
        }
        setCountry({
          found: true,
          data: {
            name: countryData.name?.common || countryData.name,
            capital: Array.isArray(countryData.capital)
              ? countryData.capital[0]
              : countryData.capital,
            population: countryData.population,
            flag: countryData.flags?.png || countryData.flag,
          },
        });
      })
      .catch((error) => {
        console.error('API Error:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);

        setCountry({
          found: false,
        });
      });
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flag}
        height="100"
        alt={`flag of ${country.data.name}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField('text');
  const [name, setName] = useState('');
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
