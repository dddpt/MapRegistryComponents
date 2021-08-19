import React from "react";
import { DeleteIcon } from "./utils";

const Option = ({ option, selected, className = "", onClick = () => {} }) => (
  <li
    className={className + (selected ? " option-selected" : "")}
    key={option.key}
    onClick={(e) => {
      e.stopPropagation();
      onClick(option);
    }}
  >
    {option.value} {selected && <DeleteIcon />}
  </li>
);

export default Option;
