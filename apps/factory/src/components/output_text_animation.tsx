import { Box, Typography } from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";

type OutputTextAnimationProps = {
  output: string;
  modelType: string;
  tokens?: number;
};

const OutputTextAnimation: React.FC<OutputTextAnimationProps> = ({
  output,
  modelType,
  tokens,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  function extractCodeBlock(input: string): string | null {
    const regex = /```([\s\S]+?)```/;
    const match = input.match(regex);

    return match ? match[1]!.trim() : null;
  }

  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    if (modelType === ModelTypeSchema.Enum.TEXT2TEXT) {
      let currentIndex = 0;

      const intervalId = setInterval(() => {
        if (currentIndex <= output.length) {
          setDisplayedText(output.slice(0, currentIndex));
          currentIndex++;
          scrollToBottom(); // Scroll to bottom whenever new text is added
        } else {
          clearInterval(intervalId);
        }
      }, 10);

      return () => clearInterval(intervalId);
    } else {
      setDisplayedText(output);
      scrollToBottom(); // Scroll to bottom whenever new text is added
      if (containerRef.current) containerRef.current.scrollLeft = 0;
    }
  }, [output, modelType]);

  return (
    <Box
      ref={containerRef}
      sx={{
        maxWidth: "700px",
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "Highlight",
        },
        maxHeight: "150px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          boxShadow: "none",
        },
      }}
    >
      {tokens ? (
        <>
          <Typography variant="body2" textAlign={"left"}>
            <pre>
              <code>{displayedText}</code>
            </pre>
          </Typography>
          <p>tokens: {tokens}</p>
        </>
      ) : (
        <Typography variant="body2" textAlign={"left"}>
          <pre>
            <code>{displayedText}</code>
          </pre>
        </Typography>
      )}
    </Box>
  );
};

export default OutputTextAnimation;
