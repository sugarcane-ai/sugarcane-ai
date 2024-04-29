import React from "react";
import { ChatMessage, Message } from "../base_styled";

const AssistantMessage = ({
  finalOutput,
  aiResponse,
  currentStyle,
  position,
  buttonId,
  messageStyle,
}) => {
  console.log(position);
  return (
    <ChatMessage
      container={currentStyle?.container}
      position={position}
      style={messageStyle}
      id={`sugar-ai-chat-message-${buttonId}`}
      className="sugar-ai-chat-message"
    >
      {finalOutput && (
        <Message
          theme={currentStyle?.theme}
          id={`sugar-ai-message-${buttonId}`}
          className="sugar-ai-message"
        >
          {finalOutput}
        </Message>
      )}
      {aiResponse && (
        <Message
          theme={currentStyle?.theme}
          id={`sugar-ai-message-${buttonId}`}
          className="sugar-ai-message"
          role="assistant"
        >
          {aiResponse}
        </Message>
      )}
    </ChatMessage>
  );
};

export default AssistantMessage;
