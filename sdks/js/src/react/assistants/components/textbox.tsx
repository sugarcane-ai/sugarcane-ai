import Mic from "../../icons/mic";
import {
  TextBox as TextBoxStyled,
  TextBoxButton,
  TextBoxContainer,
  TextBoxWrapper,
} from "../base_styled";
import { useState } from "react";
import Chat from "../../icons/chat";
import Send from "../../icons/send";
import Loader from "../../icons/loader";
import QuickReplys from "./quick_replies";
import QuickReplies from "./quick_replies";

const TextBox = ({
  currentStyle,
  position,
  buttonId,
  // setTextMessage,
  // textMessage,
  startSending,
  enableKeyboard,
  isprocessing,
  iskeyboard,
  quickReplies,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  const onTyping = (text: string) => {
    setTextMessage(text);
    setIsTyping(text.length !== 0);
  };

  const commonProps = {
    width: "26",
    height: "30",
    color: currentStyle?.keyboardButton?.bgColor,
    size: currentStyle?.keyboardButton?.iconSize,
    onClick: async (e) => {
      e.preventDefault();
      if (isTyping) {
        setTextMessage("");
        setIsTyping(false);
        await startSending(textMessage);
      } else {
        enableKeyboard();
      }
    },
  };

  const loaderProps = {
    color: currentStyle?.keyboardButton?.bgColor,
    width: "30",
    height: "30",
  };

  const handleQuickReplyClick = (question) => {
    const questionText = question.text;
    startSending(questionText);
    console.log("Question clicked:", questionText);
  };

  debugger;

  return (
    <TextBoxContainer
      container={currentStyle?.container}
      position={position}
      id={`sugar-ai-text-box-container-${buttonId}`}
      className="sugar-ai-text-box-container"
    >
      {
        <QuickReplies
          currentStyle={currentStyle}
          quickReplies={quickReplies}
          onClick={handleQuickReplyClick}
        />
      }
      <TextBoxWrapper>
        <TextBoxStyled
          type="text"
          placeholder={currentStyle?.keyboardButton?.placeholder}
          value={textMessage}
          color={currentStyle?.keyboardButton?.bgColor}
          bgColor={currentStyle?.keyboardButton?.color}
          onChange={(e) => {
            onTyping(e.target.value);
          }}
          autoComplete="off"
          onKeyUp={async (e) => {
            const msg = textMessage.trim();
            if (e.key === "Enter" && msg !== "") {
              setTextMessage("");
              setIsTyping(false);
              await startSending(msg);
            }
          }}
          id={`sugar-ai-text-box-${buttonId}`}
          className="sugar-ai-text-box"
          disabled={isprocessing}
        />
        <TextBoxButton iskeyboard={iskeyboard.toString()}>
          {isTyping || iskeyboard ? (
            isTyping ? (
              <Send {...commonProps} />
            ) : isprocessing ? (
              <Loader {...loaderProps} />
            ) : (
              <Chat {...commonProps} />
            )
          ) : isprocessing ? (
            <Loader {...loaderProps} />
          ) : (
            <Mic {...commonProps} />
          )}
        </TextBoxButton>
      </TextBoxWrapper>
    </TextBoxContainer>
  );
};

export default TextBox;
