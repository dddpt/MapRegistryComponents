import React, { useEffect, useMemo, useState, createRef } from "react";
import useClickedOutsideEffect from "../../effects/useClickedOutsideEffect";

import "./MultiSelect.scss";
import Option from "./Option";
import SelectedOption from "./SelectedOption";
import {
  BACKSPACE_KEYCODE,
  DeleteIcon,
  ENTER_KEYCODE,
  ToggleIcon,
} from "./utils";

/*
Sliced Multiselect component

This component offers a searchable dropdown that acts as a <select multiple> replacement.
The search in the dropdown is done by entering text and it returns proposition if they start by or inclue the text.
It slices the numbers of proposition seen in the dropdown to reduce the number of elements created in the DOM.
*/
const MultiSelect = ({
  className = "",
  onChange = () => {},
  options = [], // Options that can be chosen
  slice = 50, // Number of options to show, then the additional options are loaded on demand.
  maxChars = 20, // Limit the number of characters in the display of selected option
  defaultValue = [], // Default selected options
  ...props
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentSlice, setCurrentSlice] = useState(slice);
  const [selectedOptions, setSelectedOptions] = useState(
    defaultValue ? defaultValue : []
  );

  // Trigger parent onChange
  useEffect(() => {
    onChange(selectedOptions.map(({ key }) => key));
  }, [selectedOptions, onChange]);

  // Set filtered options and sliced options
  const filteredOptions = useMemo(() => {
    const matchByStart = [];
    const matchByInclusion = [];

    for (const option of options) {
      if (option.value.toLowerCase().includes(filterValue.toLowerCase())) {
        if (option.value.toLowerCase().startsWith(filterValue.toLowerCase())) {
          matchByStart.push(option);
        } else {
          matchByInclusion.push(option);
        }
      }
    }

    return selectedOptions.concat(
      matchByStart
        .concat(matchByInclusion)
        .filter(
          (option) =>
            selectedOptions.map(({ key }) => key).indexOf(option.key) === -1
        )
    );
  }, [filterValue, options, selectedOptions]);

  const slicedOptions = useMemo(() => filteredOptions.slice(0, currentSlice), [
    filteredOptions,
    currentSlice,
  ]);

  // Handle functions

  // When reaching end of scrolling, add more items to the slice
  const handleScroll = (event) => {
    const target = event.target;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      setCurrentSlice(currentSlice + slice);
    }
  };

  const handleOptionClick = (option) => {
    const indexOfKey = selectedOptions
      .map(({ key }) => key)
      .indexOf(option.key);
    const newSelectedOptions = selectedOptions.slice(0);
    if (indexOfKey === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(indexOfKey, 1);
    }
    setSelectedOptions(newSelectedOptions);
    clearFilter();
    focusInput();
  };

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === ENTER_KEYCODE && filterValue.length === 0) {
      const newSelectedOptions = selectedOptions.slice(0);
      newSelectedOptions.pop();
      setSelectedOptions(newSelectedOptions);
    }

    if (
      keyCode === BACKSPACE_KEYCODE &&
      slicedOptions.length > selectedOptions.length
    ) {
      const newSelectedOptions = selectedOptions.slice(0);
      newSelectedOptions.push(slicedOptions[newSelectedOptions.length]);
      setSelectedOptions(newSelectedOptions);
      clearFilter();
    }
  };

  const componentRef = createRef();
  const dropdownRef = createRef();
  const inputRef = createRef();

  useClickedOutsideEffect(() => setDropdownVisible(false), componentRef);

  const resetAutocompleteDropdown = () => {
    setCurrentSlice(slice);
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  };

  const focusInput = () => inputRef.current && inputRef.current.focus();

  const clearFilter = () => {
    setFilterValue("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div {...props} className={`multiselect ${className}`} ref={componentRef}>
      <div className="multiselect-input">
        <div className="multiselect-input-content" onClick={focusInput}>
          {selectedOptions.map((option) => (
            <SelectedOption
              baseClassName={"multiselect-input"}
              key={option.key}
              maxChars={maxChars}
              option={option}
              onClickRemove={handleOptionClick}
            />
          ))}
          <div className="multiselect-input-filter">
            {filterValue}
            <input
              ref={inputRef}
              type="text"
              placeholder=""
              onFocus={() => setDropdownVisible(true)}
              onChange={(e) => {
                setFilterValue(e.target.value);
                resetAutocompleteDropdown();
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="multiselect-input-indicators">
          {(selectedOptions.length > 0 || filterValue.length > 0) && (
            <div
              className="multiselect-input-indicators-icon"
              onClick={() => {
                setSelectedOptions([]);
                clearFilter();
                setDropdownVisible(false);
              }}
            >
              <DeleteIcon />
            </div>
          )}
          <span className="multiselect-input-indicators-separator" />
          <div
            className={`multiselect-input-indicators-icon multiselect-input-indicators-icon-togggle${
              dropdownVisible ? " dropdown-visible" : ""
            }`}
            onClick={() =>
              dropdownVisible ? setDropdownVisible(false) : focusInput()
            }
          >
            <ToggleIcon />
          </div>
        </div>
      </div>
      <div
        ref={dropdownRef}
        className={`multiselect-dropdown${
          dropdownVisible ? " dropdown-visible" : ""
        }`}
        onScroll={handleScroll}
      >
        <ul className="multiselect-dropdown-options-list">
          {slicedOptions.map((option) => (
            <Option
              className="multiselect-dropdown-option"
              key={option.key}
              option={option}
              selected={
                selectedOptions.map(({ key }) => key).indexOf(option.key) !== -1
              }
              onClick={handleOptionClick}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultiSelect;
