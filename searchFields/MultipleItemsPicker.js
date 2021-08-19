import React from "react";
import { useGet } from "restful-react";
import MultiSelect from "./multiSelect/MultiSelect";

/*
Wrapper for a select multiple component.
Allows to simply change the underlying multiselect.
The options can be mapped through a function to have the format required by the underlying multiselect.
*/
export const MultipleItemsPicker = ({
  className = "",
  id = "",
  options,
  mapOptions = (options) => options,
  defaultValue = null,
  onChange = () => {},
  ...props
}) => (
  <MultiSelect
    {...props}
    className={`multiple-items-picker ${className}`}
    id={id}
    slice={100}
    defaultValue={defaultValue}
    options={options ? mapOptions(options) : []}
    onChange={onChange}
  />
);

/*
Multiselect with remote options.
The options are loaded from the API from a specified path.
*/
export const MultipleRemoteItemsPicker = ({ itemsPath, ...props }) => {
  const { data: itemsChoices } = useGet({
    path: itemsPath,
  });

  return <MultipleItemsPicker {...props} options={itemsChoices} />;
};
