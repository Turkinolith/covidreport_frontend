import React, { useState, useEffect } from "react";
import { Map, Marker, Popup, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import L from "leaflet";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { getCountries, getFakeCountries } from "./../services/countryService";
import usstates from "../data/usstates";

function CovidMap(props) {
  const [countries, setCountries] = useState([
    {
      _id: "",
      FIPS: 0,
      Admin2: "",
      Province_State: "",
      Country_Region: "",
      Last_Update: "",
      Lat: 34.22333378,
      Long_: -82.46170658,
      Confirmed: 0,
      Deaths: 0,
      Recovered: 0,
      Active: 0,
      Combined_Key: ""
    }
  ]);

  //* Load data from DB and save it to state.
  useEffect(() => {
    const fetchData = async () => {
      let { data: countryData } = await getCountries();
      //let countryData = await getFakeCountries();
      console.log("countryData is :", countryData);
      setCountries(countryData);
    };
    fetchData();
  }, []);

  let mapConfig = {};
  mapConfig.params = {
    center: [39.809, -98.556],
    zoom: 4,
    minzoom: 3,
    maxzoom: 10
  };
  mapConfig.tileLayer = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  };
  const customMarker = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    iconSize: [5, 10],
    iconAnchor: [5, 10],
    popupAnchor: [2, -10]
  });

  /////////////////////////////////
  //* OLD VERSION THAT WORKS
  // {mapData.map(({ lat, lng }, index) => (
  //     <Marker position={[lat, lng]} key={index} icon={customMarker}>
  //       <Popup>
  //         {index + 1} is for popup with lat: {lat} and lon {lng}
  //       </Popup>
  //     </Marker>
  //   ))}
  ////////////////////////////////

  return (
    <div className="mapgroup__container">
      <Map
        center={mapConfig.params.center}
        zoom={mapConfig.params.zoom}
        minZoom={mapConfig.params.minzoom}
        maxZoom={mapConfig.params.maxzoom}
      >
        <TileLayer
          url={mapConfig.tileLayer.url}
          attribution={mapConfig.tileLayer.attribution}
        />
        <GeoJSON data={usstates} />
        {countries ? (
          countries.map(
            (
              {
                Province_State,
                Country_Region,
                Last_Update,
                Lat,
                Long_,
                Confirmed,
                Deaths,
                Recovered,
                Combined_Key
              },
              index
            ) => {
              return (
                <Marker position={[Lat, Long_]} key={index} icon={customMarker}>
                  <Popup>
                    {Province_State ? Province_State : Country_Region}
                    <br></br>Confirmed cases: {Confirmed}
                    <br></br> Deaths: {Deaths}
                    <br></br> Recovered: {Recovered}
                    <br></br> Data last updated: {Last_Update}
                  </Popup>
                  <Tooltip>
                    {Combined_Key} has {Confirmed} confirmed cases.
                  </Tooltip>
                </Marker>
              );
            }
          )
        ) : (
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={10000}
          />
        )}
      </Map>
    </div>
  );
}

export default CovidMap;
