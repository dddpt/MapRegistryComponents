import React, { useState } from "react";

import { useDebouncedEffect } from "../effects/useDebouncedEffect";

const DebouncedTextInput = ({ delay = 500, onChange = () => {} }) => {
  const [query, setQuery] = useState("");

  useDebouncedEffect(() => onChange(query), delay, [query]);

  return (
    <input onChange={(event) => setQuery(event.target.value)} type="text" />
  );
};

export default DebouncedTextInput;
