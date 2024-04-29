import React from "react";
import { KeyboardButton } from "../base_styled";
import Keyboard from "../../icons/keyboard";

const AssistantKeyboard = ({ style, currentStyle, enableKeyboard }) => {
  return (
    <KeyboardButton
      className="sugar-ai-copilot-keyboard-button"
      style={style}
      button={currentStyle}
      onClick={enableKeyboard}
    >
      <Keyboard width={"20"} height={"14"} color={currentStyle?.bgColor} />
    </KeyboardButton>
  );
};

export default AssistantKeyboard;
