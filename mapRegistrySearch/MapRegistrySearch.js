import React, { useEffect, useCallback, useState, createRef } from "react";
import ReactDOM from 'react-dom'; 
import { RestfulProvider } from "restful-react";

import "../css/style.scss";
import "./MapRegistrySearch.scss";

import ResultsList from "../results/ResultsList";
import { DatasetOption } from "./DatasetOption";

export function MapRegistrySearch({
  // props coming from global App parent component
  dataset,
  mapbox,
  mapRef,
  resultsTabRef,
  searchBounds,
  isActive,
  setActive,
  mapClickedFeatures,
  // props coming from the Registry parent component
  apiBaseUrl,
  Search, // some component to do the search
  EntryVignette, // some component to display a vignette for a single result
  entriesIdsToHighilightFilter=(highlightedEntriesIds)=>{},
  mapFeatureToEntryId=(mapFeature)=>{},
  mapFeaturesFilter=(mapFeature)=>{},
  entryIdToEntryIndex=(latestEntryIdClickedOnMap, entryIdToEntryIndexList)=>{},
  entryToMapBoundsPadding=(entry)=>{},
  getEntryId= entry=> entry.id,
  formatReadableQuery=()=>{},
  mapSources={},
  mapLayers=[],
  aboveLayerId=null, // layer that will be above this registry's mapLayers
  mapHighlightLayerId=null,
  addMapSource=()=>{},
  addMapLayer=()=>{}
}) {
  const [entries, setEntries] = useState([]);
  const [highlightedEntriesIds, setHighlightedEntriesIds] = useState([]);
  const [entryIdAndIndexList, setEntryIdAndIndexList] = useState(
    []
  );

  const [query, setQuery] = useState({});
  const [numEntries, setnumEntries] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  const [latestEntryIdClickedOnMap, setLatestEntryIdClickedOnMap] = useState(null);
  const [latestEntriesClickedOnMap, setLatestEntriesClickedOnMap] = useState([]);// show-all-infos specifics
  const [latestEntryIdClickedOnVignette, setLatestEntryIdClickedOnVignette] = useState(null);


  // Usecallbacks are needed below in order to minimize the number of times
  // the function is updated which triggers children components each time.
  const handleEntriesChange = useCallback(
    (results) => {
      if (results) {
        setnumEntries(results.numResults);
        setNumPages(Math.ceil(results.numResults / limit));
        setEntries(results.results);
      }
    },
    [setEntries, setnumEntries, setNumPages, limit]
  );

  const handlePageChange = useCallback(
    (selected) => {
      setOffset(selected * limit);
    },
    [limit]
  );

  const resultsListRef = createRef();
  const handleQueryChange = useCallback((newQuery) => {
    setOffset(0);
    resultsListRef.current?.scrollToTop();
    setQuery(newQuery)
  }, [resultsListRef]);

  // entryIdAndIndexList contains for each entry its id, and its index in the current search results
  useEffect(() => {
    if ((!entryIdAndIndexList) || (!latestEntryIdClickedOnMap)) {
      return;
    }
    const firstIndex = entryIdToEntryIndex(latestEntryIdClickedOnMap, entryIdAndIndexList)
    if (firstIndex!==null) {
      setOffset(Math.floor(firstIndex / limit) * limit);
    }
  }, [latestEntryIdClickedOnMap, entryIdAndIndexList, entryIdToEntryIndex, limit]);

  const handleEntryVignetteClick = useCallback(entry => {
    const boundsPadding = entryToMapBoundsPadding(entry)
    boundsPadding && boundsPadding.bounds && mapbox?.fitBounds(boundsPadding.bounds, { padding: boundsPadding.padding });
    setLatestEntryIdClickedOnMap(null)
    setLatestEntryIdClickedOnVignette(getEntryId(entry))
  },[mapbox, setLatestEntryIdClickedOnVignette, setLatestEntryIdClickedOnMap, getEntryId]);

  // add Cadaster map sources&layers
  useEffect(()=>{
    if(isActive){
      // sources
      Object.keys(mapSources).forEach(source=>{
        addMapSource(source, mapSources[source])
      })
      //layers
      mapLayers.forEach(layer=>{
        addMapLayer(layer, aboveLayerId)
      })
    }
  }, [isActive, mapSources, mapLayers, aboveLayerId])

  // Effect to show/hide cadaster layers when isActive changes
  useEffect(() => {
    if (mapbox) {
      const visibility = isActive? "visible" : "none"
      mapLayers
        .filter(ml=>ml.id!==mapHighlightLayerId)
        .forEach(ml => {
          if(mapbox.getLayer(ml.id)){
            mapbox.setLayoutProperty(ml.id, "visibility", visibility)
          }
        })
      if(mapbox.getLayer(mapHighlightLayerId)){
        if(highlightedEntriesIds && highlightedEntriesIds.length > 0){
          mapbox.setLayoutProperty(mapHighlightLayerId, "visibility", visibility);
        }else{
          mapbox.setLayoutProperty(mapHighlightLayerId, "visibility", "none");
        }
      }
    }
  }, [mapbox, highlightedEntriesIds, mapHighlightLayerId, mapLayers, isActive]);

  /*
    Effect to update the highlighted entries when the filters changed

    The effect first triggers the loading state of the map and resets it
    when the map is idle.
    */
  useEffect(() => {
    if (mapbox && highlightedEntriesIds && highlightedEntriesIds.length > 0 ){

      const visibility = isActive? "visible" : "none"

      const entriesHighlightFilter = entriesIdsToHighilightFilter(highlightedEntriesIds)
    
      // Hide the mapbox to avoid blinking
      mapbox.setLayoutProperty(mapHighlightLayerId, "visibility", "none");

      mapRef.current?.setIsHighlightLoading(true);
      const filters_all = ["all", ...entriesHighlightFilter];
      mapbox.setFilter(mapHighlightLayerId, filters_all);
      mapbox.once("idle", () => {
        mapbox.setLayoutProperty(mapHighlightLayerId, "visibility", visibility);
        mapRef.current?.setIsHighlightLoading(false);
      });
    }
  }, [mapbox, isActive, highlightedEntriesIds, entriesIdsToHighilightFilter, mapHighlightLayerId, mapRef]);

  // handle mapClickedFeatures
  useEffect(() => {
    if (isActive && mapClickedFeatures && mapClickedFeatures.length > 0) {
      const mapFeatures = mapClickedFeatures.filter(mapFeaturesFilter)
      if(mapFeatures.length>0){
        setLatestEntryIdClickedOnMap(mapFeatureToEntryId(mapFeatures[0]))// show-all-infos specifics
        setLatestEntryIdClickedOnVignette(null)
        setLatestEntriesClickedOnMap(mapFeatures)
      }
    }
  }, [isActive, entryIdAndIndexList, mapFeatureToEntryId, mapClickedFeatures, mapFeaturesFilter])


  return (
    <RestfulProvider
      base={apiBaseUrl}
      queryParamStringifyOptions={{ indices: false, skipNulls: true }}
    >

      <DatasetOption
        isActive={isActive}
        setActive={setActive}
        dataset={dataset}
        query={query}
        formatReadableQuery={formatReadableQuery}
      >
        <div className={"dataset-search "+ (isActive? "active" : "") }>
          <Search
            searchBounds={searchBounds}
            onHighlightedEntriesIdsChange={setHighlightedEntriesIds}
            onEntriesIndicesChange={setEntryIdAndIndexList}
            onEntriesChange={handleEntriesChange}
            onQueryChange={handleQueryChange}
            offset={offset}
            limit={limit}
          />
        </div>

      </DatasetOption>
      {resultsTabRef?.current?
        ReactDOM.createPortal(
            <ResultsList
                ref={resultsListRef}
                entries={entries}
                numEntries={numEntries}
                numPages={numPages}
                forcePage={Math.floor(offset / limit)}
                onEntryClick={handleEntryVignetteClick}
                latestEntryIdClickedOnMap={latestEntryIdClickedOnMap}
                latestEntryIdClickedOnVignette={latestEntryIdClickedOnVignette}
                latestEntriesClickedOnMap={latestEntriesClickedOnMap} // show-all-infos specifics
                mapFeatureToEntryId={mapFeatureToEntryId} // show-all-infos specifics
                getEntryId={getEntryId}
                onPageChange={handlePageChange}
                onLimitChange={setLimit}
                EntryVignette={EntryVignette}
            />,
            resultsTabRef.current) : null
      }          
    </RestfulProvider>
  );
}

export default MapRegistrySearch;
