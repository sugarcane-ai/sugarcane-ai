import Arrow from "~/react/icons/arrow";
import { QuickRepliesContainer, QuickReplyButton } from "../base_styled";
import {
  CopilotSytleType,
  QuickRepliesType,
  QuickReplyType,
} from "@sugar-ai/core";

const QuickReplies = ({
  quickReplies,
  currentStyle,
  onClick,
}: {
  quickReplies: any[];
  currentStyle: CopilotSytleType;
  onClick: any;
}) => {
  return (
    <QuickRepliesContainer className="sugar-ai-quick-replies">
      {quickReplies.map((quickReply, index) => (
        <QuickReplyButton
          key={index}
          onClick={() => onClick(quickReply)}
          theme={{
            bgColor: currentStyle?.keyboardButton?.color || "#f5f5f5",
            textColor: currentStyle?.theme?.textColor || "#333",
            borderColor: currentStyle?.theme?.primaryColor,
            // hoverBgColor: "#e0e0e0",
            // focusColor: "#2563eb",
          }}
        >
          <span className="hidden-on-sm">{quickReply?.short}</span>
          <span className="hidden-on-md">{quickReply?.text}</span>
          <Arrow size="16" color="#333" />
        </QuickReplyButton>
      ))}
    </QuickRepliesContainer>
  );
};

export default QuickReplies;
