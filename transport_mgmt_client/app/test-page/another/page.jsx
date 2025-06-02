"use client";

import React, { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

// Create Routing component
const Routing = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || markers.length < 2) return;

    const L = require("leaflet");
    const routing = require("leaflet-routing-machine");

    const instance = L.Routing.control({
      waypoints: markers.map((marker) => L.latLng(...marker.geocode)),
      routeWhileDragging: true,
      show: false,
    }).addTo(map);

    return () => map.removeControl(instance);
  }, [map, markers]);

  return null;
};

// Main Page
const Page = () => {
  const markers = [
    {
      geocode: [-0.5580464, 37.2968016],
      popUp: "Hello, I am pop up 1",
    },
    {
      geocode: [-0.5731, 37.32788],
      popUp: "Hello, I am pop up 2",
    },
  ];

  const customIcon = new Icon({
    iconUrl: "/map.png",
    iconSize: [38, 38],
  });

  return (
    <MapContainer
      center={[-0.5580464, 37.2968016]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {markers.map((marker, index) => (
        <Marker key={index} position={marker.geocode} icon={customIcon} />
      ))}

      <Routing markers={markers} />
    </MapContainer>
  );
};

export default Page;
