import React, {
  createRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  useRef
} from "react";
import Pagination from "./Pagination";

import "./ResultsList.scss";

const ResultsList = forwardRef(
  (
    {
      entries = [],
      latestEntryIdClickedOnMap=null,
      latestEntryIdClickedOnVignette=null,
      getEntryId = entry=> {},
      getEntryKey = entry=> entry.id,
      numEntries = 0,
      numPages = 0,
      forcePage = null,
      onPageChange = () => {},
      onEntryClick = () => {},
      onLimitChange = () => {},
      latestEntriesClickedOnMap=[],
      mapFeatureToEntryId = ()=>{},
      EntryVignette
    },
    resultsListRef
  ) => {

    const resultsRef = useRef()
    const entriesWithRefs = entries.map(p => ({ resultRef: createRef(), entry: p }))

    const scrollTo = useCallback(
      (entryIdToScrollTo) => {
        const filteredEntriesRefs = entriesWithRefs.filter(
          ({ entry }) => entryIdToScrollTo === getEntryId(entry)
        );
        if (filteredEntriesRefs.length > 0) {
          filteredEntriesRefs[0].resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      },
      [entriesWithRefs, getEntryId]
    );

    useEffect(() => {
      latestEntryIdClickedOnMap && scrollTo(latestEntryIdClickedOnMap);
    }, [latestEntryIdClickedOnMap, entriesWithRefs, scrollTo]);

    useImperativeHandle(resultsListRef, () => ({
      scrollTo: (entryNumToScrollTo) => scrollTo(entryNumToScrollTo),
      scrollToTop: () => {
        resultsRef.current?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
    }));

    return (
      <div ref={resultsListRef} className="parcel-results">
        <div className="parcel-results-pagination">
          <div className="result-number">
            {numEntries>0? numEntries +" entries" : ""}
          </div>
          <Pagination
            numPages={numPages}
            onPageChange={onPageChange}
            pageRangeDisplayed={2}
            numNeighbours={1}
            forcePage={forcePage}
          />
          <div className="select-limit">
            <select
              className="form-select"
              defaultValue={"20"}
              onChange={(e) => {
                onLimitChange(parseInt(e.target.value));
              }}
            >
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        <div className="parcel-results-list" ref={resultsRef}>
          
          {entriesWithRefs && entriesWithRefs.length > 0 ?
              entriesWithRefs.map(({entry, resultRef}) => {
                return (
                  <EntryVignette
                    ref={resultRef}
                    key={getEntryKey(entry)}
                    className={([latestEntryIdClickedOnMap,latestEntryIdClickedOnVignette].includes((getEntryId(entry)))? " emphasis":" ")}
                    onClick={() => onEntryClick(entry)}
                    entry={entry}
                    mapFeatures={latestEntriesClickedOnMap.filter(ecm=>mapFeatureToEntryId(ecm)==getEntryId(entry))}
                  />
                );
              }) : <p>No results, sorry...</p>}
        </div>
      </div>
    );
  }
);

export default ResultsList;
