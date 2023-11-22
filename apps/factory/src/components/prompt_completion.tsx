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
}

const PromptCompletion: React.FC<PromptCompletionProps> = ({
  modelType,
  output,
  tokens,
  imgClassName,
}) => {
  if (modelType === ModelTypeSchema.Enum.TEXT2TEXT) {
    return (
      <>
        {window.location.href.includes("/logs") ? (
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
                {output}
              </Typography>
            )}
          </Box>
        ) : (
          <OutputTextAnimation output={output} modelType={modelType} />
        )}
      </>
    );
  } else {
    return <img className={imgClassName} src={output} alt="Image" />;
  }
};

export default PromptCompletion;
