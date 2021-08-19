import React, {
  useImperativeHandle,
  createRef,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import mapboxgl from "maplibre-gl";

import { useDebouncedEffect } from "../effects/useDebouncedEffect";

import {
  DEFAULT_LNG,
  DEFAULT_LAT,
  DEFAULT_ZOOM,
  BOUNDS,
  MAX_BOUNDS,
} from "./utils";
import { CenterButton, ClearBoundsButton } from "./buttons";
import addQueryBoxToMap from "./queryBox";

import "./Map.scss";

const Map = forwardRef(
  (
    {
      onMove = () => {},
      mapClickLayers=[],
      setMapClickedFeatures = () => {},
      onSelectedBbox = () => {},
      setMapbox = ()=>{},
      mapStyle,
      mapSources={},
      mapLayers=[],
      extraButtons=[],
      extraButtonsRefs=[]
    },
    mapRef
  ) => {
    const [map, setMap] = useState(null);
    const [isHighlightLoading, setIsHighlightLoading] = useState(false);
    const [lng, setLng] = useState(DEFAULT_LNG);
    const [lat, setLat] = useState(DEFAULT_LAT);
    const [zoom, setZoom] = useState(DEFAULT_ZOOM);

    const mapContainerRef = createRef();

    const centerButtonRef = createRef();
    const clearBoundsButtonRef = createRef();

    /*
    Effect triggered only once to initialize the map and its callbacks.

    Note that any callback defined in this effect cannot change and is fixed
    for the life of the component.
    Usually, using only states is the safest way to communicate with the rest of the app.
    */
    useEffect(() => {
      // Create the map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: [DEFAULT_LNG, DEFAULT_LAT],
        zoom: DEFAULT_ZOOM,
        maxBounds: MAX_BOUNDS,
        transformRequest: (url, resourceType) => {
          if (/^local:\/\//.test(url)) {
            return {
              url: new URL(url.substr("local://".length), window.location.href)
                .href,
            };
          }
        },
      });

      map.fitBounds(BOUNDS);

      const navControl = new mapboxgl.NavigationControl();
      navControl._container.appendChild(centerButtonRef.current);
      navControl._container.appendChild(clearBoundsButtonRef.current);
      extraButtonsRefs.forEach(ref=>
        navControl._container.appendChild(ref.current)
      )
      map.addControl(navControl, "top-right");

      map.addControl(new mapboxgl.ScaleControl());

      map.on("move", () => {
        setZoom(map.getZoom().toFixed(2));
        setLat(map.getCenter().lat.toFixed(4));
        setLng(map.getCenter().lng.toFixed(4));
      });

      addQueryBoxToMap(map, onSelectedBbox);

      // When the map is loaded, resize it and set the map state
      map.on("load", () => {
        map.resize();
        setMap(map);
        setMapbox(map)
        window.mapboxx=map
      });

      return () => map.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // add Map Sources and Layers from App
    useEffect(()=>{
      if(map){
        // sources
        Object.keys(mapSources).forEach(source=>{
          if(!map.getSource(source)){
            map.addSource(source, mapSources[source])
          }
        })
        //layers
        mapLayers.forEach(({layer, aboveLayerId})=>{
          if(!map.getLayer(layer.id)){
            map.addLayer(layer, aboveLayerId)
          }
        })
      }
    },[map, mapSources, mapLayers])

    // When clicking on the map, trigger setMapClickedFeatures()
    useEffect(()=>{
      map?.on("click", (e) => {
        const bbox = [
          [e.point.x, e.point.y],
          [e.point.x, e.point.y],
        ];
        const features = map.queryRenderedFeatures(bbox, {
          layers: mapClickLayers.filter(l=>map.getLayer(l)),
        });
        if (features && features.length > 0) {
          setMapClickedFeatures(features)
        }
      });

    },[map, setMapClickedFeatures, mapClickLayers])

    useDebouncedEffect(
      () => {
        onMove({
          lng: lng,
          lat: lat,
          zoom: zoom,
        });
      },
      100,
      [lng, lat, zoom]
    );


    useImperativeHandle(mapRef, () => ({
      mapbox: map,
      resize: () => map?.resize(),
      fitBounds: (bounds, args) => map?.fitBounds(bounds, args),
      setIsHighlightLoading: setIsHighlightLoading
    }));

    return (
      <div className="map" ref={mapRef}>
        <div
          className="map-container"
          ref={mapContainerRef}
          style={isHighlightLoading ? { opacity: 0.4 } : {}}
        />
        <CenterButton
          ref={centerButtonRef}
          onClick={() => map?.fitBounds(BOUNDS)}
        />
        <ClearBoundsButton
          ref={clearBoundsButtonRef}
          onClick={() => onSelectedBbox(null)}
        />
        {extraButtons}
      </div>
    );
  }
);

export default Map;
