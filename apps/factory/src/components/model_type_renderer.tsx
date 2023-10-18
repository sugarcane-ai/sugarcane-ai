import React from "react";
import Typography from "@mui/material/Typography";
import {
  ModelTypeType,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";

interface ModelTypeRendererProps {
  modelType: ModelTypeType;
  output: string;
  tokens?: number;
  imgClassName?: string;
}

const ModelTypeRenderer: React.FC<ModelTypeRendererProps> = ({
  modelType,
  output,
  tokens,
  imgClassName,
}) => {
  if (modelType === ModelTypeSchema.Enum.TEXT2TEXT) {
    return (
      <>
        {tokens ? (
          <>
            <Typography variant="body2" textAlign="left">
              {output}
            </Typography>
            <p>tokens: {tokens}</p>
          </>
        ) : (
          <Typography variant="body2" textAlign={"left"}>
            {output}
          </Typography>
        )}
      </>
    );
  } else {
    return <img className={imgClassName} src={output} alt="Image" />;
  }
};

export default ModelTypeRenderer;
