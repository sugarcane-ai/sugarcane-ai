import React from "react";
import Typography from "@mui/material/Typography";
import {
  ModelTypeType,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";
import OutputTextAnimation from "./output_text_animation";
import { Box } from "@mui/material";

interface PromptCompletionProps {
  modelType: ModelTypeType;
  output: string;
  tokens?: number;
  imgClassName?: string;
  textAnimation: boolean;
  cube?: boolean;
}

const PromptCompletion: React.FC<PromptCompletionProps> = ({
  modelType,
  output,
  tokens,
  imgClassName,
  textAnimation,
  cube,
}) => {
  if (modelType !== ModelTypeSchema.Enum.TEXT2IMAGE) {
    return (
      <>
        {textAnimation === false ? (
          <Box
            sx={{
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
                {output}
                <p>tokens: {tokens}</p>
              </>
            ) : (
              <Typography variant="body2" textAlign={"left"}>
                <pre>
                  <code
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {output}
                  </code>
                </pre>
              </Typography>
            )}
          </Box>
        ) : (
          pl && (
            <OutputTextAnimation
              output={pl.completion}
              modelType={pl.llmModelType}
            />
          )
        )}
      </>
    );
  } else {
    return (
      <img
        className={`${
          cube ? "outputImage h-full w-full" : imgClassName
        } object-fill`}
        src={`${process.env.NEXT_PUBLIC_APP_URL}/generated/assets/logs/${pl.id}/image.png?w=${w}&h=${h}`}
        alt="Image"
      />
    );
  }
};

export default PromptCompletion;
