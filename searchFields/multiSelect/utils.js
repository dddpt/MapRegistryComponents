import { AiOutlineUp, AiOutlineClose } from "react-icons/ai";

export const DeleteIcon = AiOutlineClose;
export const ToggleIcon = AiOutlineUp;

export const ellipsisIfNeeded = (input, maxChars) => {
  if (input && input.length > maxChars) {
    return input.substring(0, maxChars) + "...";
  } else {
    return input;
  }
};

export const ENTER_KEYCODE = 8;
export const BACKSPACE_KEYCODE = 13;
