import React from "react";
import { ellipsisIfNeeded, DeleteIcon } from "./utils";

const SelectedOption = ({
  option,
  baseClassName = "",
  onClickRemove = () => {},
  maxChars = 10,
}) => {
  var addon = "";
  if (baseClassName.length > 0) {
    addon = "-";
  }
  return (
    <div className={`${baseClassName + addon}option`}>
      <div className={`${baseClassName + addon}option-label`}>
        {ellipsisIfNeeded(option.value, maxChars)}
      </div>
      <div
        className={`${baseClassName + addon}option-remove`}
        onClick={(e) => {
          e.stopPropagation();
          onClickRemove(option);
        }}
      >
        <DeleteIcon />
      </div>
    </div>
  );
};

export default SelectedOption;
