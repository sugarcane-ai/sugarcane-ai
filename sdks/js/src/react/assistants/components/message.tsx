import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, Message as MessageStyled } from "../base_styled";

const Message = ({
  finalOutput,
  aiResponse,
  currentStyle,
  position,
  buttonId,
  messageStyle,
}) => {
  const [isVisible, setIsVisible] = useState(true); // Controls visibility
  const [isFading, setIsFading] = useState(false); // Controls fade-out animation
  const autoHideTimeoutRef = useRef(null); // Keeps track of the auto-hide timeout
  const fadeTimeoutRef = useRef(null); // Keeps track of the fade-out timeout

  const calculateReadTime = (text) => {
    const words = text.split(" ").length;
    const seconds = Math.max(5, Math.ceil(words / 2)); // 2 words per second, min 5 seconds
    return seconds * 1000; // Return milliseconds
  };

  const resetHideSettings = () => {
    console.log("resetHideSettings");
    setIsVisible(true); // Make the message visible again
    setIsFading(false); // Reset fading state
    clearTimeout(autoHideTimeoutRef.current); // Clear the auto-hide timeout
    clearTimeout(fadeTimeoutRef.current); // Clear the fade-out timeout
  };

  const handleUserInteraction = () => {
    console.log("handleUserInteraction");
    if (isFading) {
      // Cancel fade-out if the user clicks during fade-out
      setIsFading(false);
      clearTimeout(fadeTimeoutRef.current);
    } else {
      // Trigger hiding when the user clicks again
      setIsFading(true);
      fadeTimeoutRef.current = setTimeout(() => setIsVisible(false), 2000); // 1-second fade-out
    }
  };

  useEffect(() => {
    resetHideSettings(); // Reset settings whenever aiResponse or finalOutput changes

    if (aiResponse) {
      const hideDelay = calculateReadTime(aiResponse);

      autoHideTimeoutRef.current = setTimeout(() => {
        setIsFading(true);
        fadeTimeoutRef.current = setTimeout(() => setIsVisible(false), 2000); // 1-second fade-out
      }, hideDelay);
    }

    return () => {
      // Clean up timeouts when component unmounts or dependencies change
      clearTimeout(autoHideTimeoutRef.current);
      clearTimeout(fadeTimeoutRef.current);
    };
  }, [aiResponse]); // Reset logic when these props change

  useEffect(() => {
    resetHideSettings(); // Reset settings whenever aiResponse or finalOutput changes
  }, [finalOutput]);

  return (
    isVisible && (
      <ChatMessage
        container={currentStyle?.container}
        position={position}
        style={{
          ...messageStyle,
          opacity: isFading ? 0 : 1, // Fade-out effect
          transition: "opacity 1s ease", // Smooth fade-out
        }}
        id={`sugar-ai-chat-message-${buttonId}`}
        className="sugar-ai-chat-message"
        onClick={handleUserInteraction}
      >
        {finalOutput && (
          <MessageStyled
            theme={currentStyle?.theme}
            id={`sugar-ai-message-${buttonId}`}
            className="sugar-ai-message"
          >
            {finalOutput}
          </MessageStyled>
        )}
        {aiResponse && (
          <MessageStyled
            theme={currentStyle?.theme}
            id={`sugar-ai-message-${buttonId}`}
            className="sugar-ai-message"
            role="assistant"
          >
            {aiResponse}
          </MessageStyled>
        )}
      </ChatMessage>
    )
  );
};

export default Message;
