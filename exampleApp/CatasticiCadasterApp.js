import React, { useState, useRef, useCallback } from "react";
import Split from "react-split-grid";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import "../css/style.scss";
import "./CatasticiCadasterApp.scss";


import {
  CADASTER1808,
  CATASTICI1741,
  DATASETS,
  GET_DATASET,
  STARTING_DATASET
} from "../../config";
import Cadaster from "../../cadaster/components/Cadaster";
import {cadasterMapClickLayers} from "../../cadaster/map";
import Catastici from "../../catastici/components/Catastici";
import {catasticiMapClickLayers} from "../../catastici/map";
import mapStyle from "./mapStyle.js";
import Map from "../map/Map";

const mapClickLayers = [...cadasterMapClickLayers, ...catasticiMapClickLayers]

const cadaster1808 = GET_DATASET(CADASTER1808)
const catastici1741 = GET_DATASET(CATASTICI1741)

function App() {

  //const [dataset, setDataset] = useState(STARTING_DATASET);
  const [mapClickedFeatures, setMapClickedFeatures] = useState([]);
  const [searchBounds, setSearchBounds] = useState(null);
  const [mapbox, setMapbox] = useState(null);
  const [mapLayers, setMapLayers] = useState([]);
  const [mapSources, setMapSources] = useState([]);
  
  const addMapLayer = useCallback((layer, aboveLayerId)=>{
    setMapLayers(oldMapLayers => [...oldMapLayers, {layer, aboveLayerId}])
  },[setMapLayers])
  const addMapSource = useCallback((sourceId, mapSource)=>{
    setMapSources(oldMapSources=>{
      const newMapSources = {...oldMapSources}
      newMapSources[sourceId] = mapSource
      return newMapSources
    })
  },[setMapSources])

  const mapRef = useRef();

  const [cadasterActive, setCadasterActive] = useState(STARTING_DATASET===CADASTER1808);
  const cadasterResultsColumnRef = useRef();

  const [catasticiActive, setCatasticiActive] = useState(STARTING_DATASET===CATASTICI1741);
  const catasticiResultsColumnRef = useRef();

  return (
    <div className="app">
      <div className="left-pane">
        <Cadaster
          mapRef={mapRef}
          resultsTabRef={cadasterResultsColumnRef}
          searchBounds={searchBounds}
          mapbox={mapbox}
          isActive={cadasterActive}
          setActive={setCadasterActive}
          mapClickedFeatures={mapClickedFeatures}
          addMapLayer={addMapLayer}
          addMapSource={addMapSource}
        />
        <Catastici
          mapRef={mapRef}
          resultsTabRef={catasticiResultsColumnRef}
          searchBounds={searchBounds}
          mapbox={mapbox}
          isActive={catasticiActive}
          setActive={setCatasticiActive}
          mapClickedFeatures={mapClickedFeatures}
          addMapLayer={addMapLayer}
          addMapSource={addMapSource}
        />
      </div>
      <Split
        onDrag={() => {
          mapbox?.resize();
        }}
        render={({ getGridProps, getGutterProps }) => (
          <div className="split-grid" {...getGridProps()}>
            <div className="split-column">
              <Map
                ref={mapRef}
                mapClickLayers={mapClickLayers}
                onSelectedBbox={(bbox) =>
                  setSearchBounds(
                    bbox && bbox.map((p) => [p.lng, p.lat]).flat()
                  )
                }
                setMapbox={setMapbox}
                setMapClickedFeatures={setMapClickedFeatures}
                mapStyle={mapStyle}
                mapLayers={mapLayers}
                mapSources={mapSources}
              />
            </div>

            <div
              // className="gutter gutter-vertical"
              // {...getGutterProps("row", 1)}
              className="gutter gutter-horizontal"
              {...getGutterProps("column", 1)}
            />

            <div className="split-column">
            <Tabs
              forceRenderTabPanel
            >
              <TabList>
                {cadasterActive? <Tab>{cadaster1808.name}</Tab> : null}
                {catasticiActive? <Tab>{catastici1741.name}</Tab> : null}
              </TabList>

              {cadasterActive? (
                <TabPanel>
                  <div className={"dataset-result "+ (cadasterActive? "active" : "")} ref={cadasterResultsColumnRef}>
                  </div>
                </TabPanel>
              ) : null}
              {catasticiActive? (
                <TabPanel>
                  <div className={"dataset-result "+ (catasticiActive? "active" : "")} ref={catasticiResultsColumnRef}>
                  </div>
                </TabPanel>
              ) : null}
            </Tabs>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default App;
