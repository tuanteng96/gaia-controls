import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import "../../../../_assets/sass/pages/_school-manage.scss";

import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyAUxLzq4fcBNNPBTJ0bXI-Km9F_0Mk2Svk");
Geocode.setLocationType("ROOFTOP");

// Enable or disable logs. Its optional.
//Geocode.enableDebug();

MapContainer.propTypes = {
  onChange: PropTypes.func,
  initialValues: PropTypes.object,
};

const containerStyle = {
  position: "relative",
  width: "100%",
  height: "250px",
  marginTop: "5px",
};

function MapContainer({ onChange, initialValues }) {
  const [MarkerCurrent, setMarkerCurrent] = useState({});
  const [Address, setAddress] = useState("");
  const [isMap, setIsMap] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
    defaultValue: initialValues.Address,
  });

  useEffect(() => {
    if (initialValues.LatLng) {
      const newObj = { lng: 21.0277644, lat: 105.8341598 };
      if (initialValues.LatLng?.lng) {
        newObj.lng = initialValues.LatLng?.lng;
      }
      if (initialValues.LatLng?.lat) {
        newObj.lat = initialValues.LatLng?.lat;
      }
      setMarkerCurrent(newObj);
    }
  }, [initialValues]);

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();
    // Get latitude and longitude via utility functions
    getGeocode({ address: description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setAddress(description);
        setMarkerCurrent({ lat, lng });
        onChange({
          address: description,
          LatLng: { lat, lng },
        });
      })
      .catch((error) => {
        console.log("😱 Error: ", error);
      });
  };

  const onMarkerClick = (props, marker, e) => {
    
  };

  const onMapClicked = (mapProps, map, clickEvent) => {
    Geocode.fromLatLng(clickEvent.latLng.lat(), clickEvent.latLng.lng()).then(
      (response) => {
        const address = response.results[0].formatted_address;
        setValue(address);
        setMarkerCurrent({
          lat: clickEvent.latLng.lat(),
          lng: clickEvent.latLng.lng(),
        });
        setAddress(address);
        setMarkerCurrent({
          lat: clickEvent.latLng.lat(),
          lng: clickEvent.latLng.lng(),
        });
        onChange({
          address: address,
          LatLng: {
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng(),
          },
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <i className="fas fa-map-marker-alt"></i>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <Fragment>
      <div ref={ref}>
        <div className="position-relative">
          <input
            className="form-control pr-55px"
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Nhập địa chỉ"
          />
          <div
            className="position-absolute top-0 right-0 w-45px h-40px d-flex align-items-center justify-content-center border-left cursor-pointer"
            onClick={() => setIsMap(!isMap)}
          >
            <i className="fas fa-map"></i>
          </div>
        </div>
        <div className="position-relative">
          {status === "OK" && (
            <ul className="list-map-google">{renderSuggestions()}</ul>
          )}
        </div>
      </div>
      <div className={`d-${isMap ? "block" : "none"}`}>
        <Map
          containerStyle={containerStyle}
          google={window.google}
          onClick={onMapClicked}
          center={MarkerCurrent}
          zoom={15}
        >
          <Marker
            title={Address}
            name={Address}
            position={MarkerCurrent}
            onClick={onMarkerClick}
          >
            {/* <InfoWindow
            marker={optionsMap.activeMarker}
            visible={optionsMap.showingInfoWindow}
          >
            <div>
              <h1>{Address}</h1>
            </div>
          </InfoWindow> */}
          </Marker>
        </Map>
      </div>
    </Fragment>
  );
}

export default GoogleApiWrapper({
  apiKey: window.GoogleMapApiKey || "AIzaSyAUxLzq4fcBNNPBTJ0bXI-Km9F_0Mk2Svk",
  libraries: ["places"],
})(MapContainer);
