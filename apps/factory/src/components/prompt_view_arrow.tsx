import React, { useEffect, useState } from "react";
import { Stack, Box, Typography, Grid } from "@mui/material";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { PromptDataType } from "~/validators/prompt_version";

interface PromptDataInputType {
  promptInputs: PromptDataType | undefined;
}

interface PromptViewArrowProps extends PromptDataInputType {
  promptTemplate: string;
  haveroleUserAssistant: boolean | undefined;
}

const PromptViewArrow: React.FC<PromptViewArrowProps> = ({
  promptTemplate,
  promptInputs,
  haveroleUserAssistant,
}) => {
  const [isTextOpen, setIsTextOpen] = useState(false);

  useEffect(() => {
    console.log(promptInputs);
  }, []);

  return (
    <div style={{ paddingLeft: 15, paddingRight: 15 }}>
      <Stack
        className="dark:border-gray-60 w-full rounded-lg border p-3 shadow"
        onClick={() => setIsTextOpen(!isTextOpen)}
        flexDirection={"row"}
        sx={{ backgroundColor: "var(--sugarcube-component-bg-color)" }}
      >
        <Box>
          {isTextOpen ? (
            <FaCaretDown
              size={20}
              style={{ paddingRight: 5, color: "var(--sugarhub-text-color)" }}
            />
          ) : (
            <FaCaretRight
              size={20}
              style={{ paddingRight: 5, color: "var(--sugarhub-text-color)" }}
            />
          )}
        </Box>
        {isTextOpen ? (
          <>
            <Typography sx={{ color: "var(--sugarhub-text-color)" }}>
              Click to view prompt Template
            </Typography>
          </>
        ) : (
          <>
            {haveroleUserAssistant ? (
              <>
                <PromptDataView promptInputs={promptInputs} />
              </>
            ) : (
              <>
                <Typography sx={{ color: "var(--sugarhub-text-color)" }}>
                  {promptTemplate}
                </Typography>
              </>
            )}
          </>
        )}
      </Stack>
    </div>
  );
};

export const PromptDataView = ({ promptInputs }: PromptDataInputType) => {
  return (
    <>
      <Grid container spacing={1} wrap="wrap">
        {promptInputs?.map((promptInput) => {
          return (
            <>
              <Grid item xs={2} md={2} lg={2}>
                <Typography sx={{ color: "var(--sugarhub-text-color)" }}>
                  {promptInput.role}
                </Typography>
              </Grid>
              <Grid item xs={10} md={10} lg={10} zeroMinWidth>
                <Typography
                  sx={{
                    overflowWrap: "break-word",
                    margin: "0 1rem",
                    color: "var(--sugarhub-text-color)",
                  }}
                >
                  {promptInput.content}
                </Typography>
              </Grid>
            </>
          );
        })}
      </Grid>
    </>
  );
};

export default PromptViewArrow;
