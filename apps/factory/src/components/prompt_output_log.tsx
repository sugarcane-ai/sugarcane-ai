import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChatIcon from "@mui/icons-material/Chat";
import Tooltip from "@mui/material/Tooltip";
import CodeHighlight from "./integration/code_highlight";
import { GenerateOutput } from "~/validators/service";

interface PromotOutputLogProps {
  pl: GenerateOutput;
}

const PromotOutputLog: React.FC<PromotOutputLogProps> = ({ pl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  let code: any = {
    id: `${pl?.id}`,
    version: `${pl?.version}`,
    environment: `${pl?.environment}`,
    labelledState: `${pl?.labelledState}`,
    llmModelType: `${pl?.llmModelType}`,
    llmProvider: `${pl?.llmProvider}`,
    llmModel: `${pl?.llmModel}`,
    promptInput: `${pl?.prompt}`,
    promptOutput: `${pl?.completion}`,
    latency: `${pl?.latency}`,
    createdAt: `${pl?.createdAt ? pl?.createdAt.toISOString() : "NA"}`,
  };
  code = JSON.stringify(code, null, 2);

  const showLogs = () => {
    return (
      <Dialog open={isOpen} onClose={handleClose} maxWidth={"md"}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h2">
            Output Log
          </Typography>
          <Typography mt={2}>
            <CodeHighlight code={code} language="json" />
          </Typography>
        </Box>
      </Dialog>
    );
  };

  return (
    <>
      <Tooltip title="Output Log">
        <ChatIcon onClick={handleOpen} />
      </Tooltip>
      {showLogs()}
    </>
  );
};

export default PromotOutputLog;
