import React, { useState, useEffect } from "react";

// CssBaseline: component from MU - normalizes the styles (fix padding, margins background colors, etc);
import { CssBaseline, Grid } from "@material-ui/core";

import { getPlacesData, getWeatherData } from "./api";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [childClicked, setChildClicked] = useState(null);

  const [coordinates, setCoordinates] = useState({});
  /* bottom left and top righ corners on the map/screen (NE and SW)*/
  const [bounds, setBounds] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState(" ");

  /* Only going to happen at the start to get the user location built in browser geoLocation */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredPlaces);
  }, [rating]);

  useEffect(() => {
    /* console.log(coordinates, bounds); */

    /* if bounds is an empty obj (truthy) then the if condition is falsy */
    /* reset the values of places when switching to a new place (removed coordinates from the dependency array) */
    if (bounds.sw && bounds.ne) {
      setIsLoading(true);
      
      getWeatherData(coordinates.lat, coordinates.lng)
        .then((data) => setWeatherData(data));

      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        /* console.log(data); */
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setFilteredPlaces([])
        setIsLoading(false);
      });
    }
  }, [type, bounds]);

  return (
    <>
      {/* React fragment */}
      <CssBaseline />
      <Header setCoordinates= {setCoordinates}/>
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.lenght ? filteredPlaces: places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.lenght ? filteredPlaces: places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
