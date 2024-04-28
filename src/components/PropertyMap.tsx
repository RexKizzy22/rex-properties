"use client";

import { useEffect, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl";
import { setDefaults, fromAddress, OutputFormat } from "react-geocode";
import Spinner from "./Spinner";
import Image from "next/image";
import pin from "@/assets/images/pin.svg";

import { SavedProperty } from "@/utils/types";

const PropertyMap = ({ property }: { property: SavedProperty }) => {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [viewport, setViewport] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const [geocodeErrorMsg, setGeocodeErrorMsg] = useState("");

  setDefaults({
    key: process.env.NEXT_PUBLIC_GEOCODE_API_KEY,
    language: "en",
    region: "us",
    outputFormat: OutputFormat.JSON,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        if (res.results.length === 0) {
          setGeocodeError(true);
          setGeocodeErrorMsg("No location data found");
          setLoading(false);
          return;
        }

        const { lat, lng } = res.results[0].geometry.location;

        setLat(lat);
        setLong(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });

        setLoading(false);
      } catch (error) {
        setGeocodeError(true);
        setGeocodeErrorMsg("Please provide a valid address for the property");
        console.error((error as Error).message);
        setGeocodeError(true);
        setLoading(false);
        return;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner loading={loading} />;

  if (geocodeError) return <div className="text-xl">{geocodeErrorMsg}</div>;

  return (
    !loading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import("mapbox-gl")}
        initialViewState={{
          longitude: long,
          latitude: lat,
          zoom: 15,
        }}
        style={{ width: "100%", height: 500 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker longitude={long} latitude={lat}>
          <Image src={pin} width={40} height={40} alt="location" />
        </Marker>
      </Map>
    )
  );
};

export default PropertyMap;
