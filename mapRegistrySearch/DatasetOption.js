import React, { useEffect, useCallback, useState, createRef } from "react";
import ReactDOM from 'react-dom'; 
import { AiOutlineDown, AiOutlineLeft } from "react-icons/ai";

import "../css/style.scss";
import "./DatasetOption.scss";

export const UnfoldedIcon = AiOutlineDown;
export const FoldedIcon = AiOutlineLeft;



export function DatasetOption({
  isActive,
  setActive=()=>{},
  dataset = null,
  query={},
  formatReadableQuery=()=>{},
  children
}) {
    const [isFolded, setFolded] = useState(true)

    return (
        <div className={"dataset-option "+ (isActive? "active" : "") }>
            <div className="dataset-header">
                <span className="active-toggle">
                    <input type="checkbox" defaultChecked={isActive} onClick={()=>setActive(!isActive)}/>
                </span>
                <span className="dataset-title">{dataset.name}</span>
                <span className="dataset-query">{formatReadableQuery(query)}</span>
                <span className={"fold-toggle "+(isActive?"": " disabled")} onClick={()=> isActive? setFolded(!isFolded): null}>
                    {isFolded || !isActive? <FoldedIcon/> : <UnfoldedIcon/>}
                </span>
            </div>
            <div className={"dataset-body "+(isActive &&(!isFolded)?" unfolded": "")}>
            {children}
            </div>
        </div>
    );
}

export default DatasetOption;
