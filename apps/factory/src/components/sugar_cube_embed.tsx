import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CodeIcon from "@mui/icons-material/Code";
import CopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import CodeHighlight from "./integration/code_highlight";
import { Button, Stack } from "@mui/material";
import toast from "react-hot-toast";

const SugarCubeEmbed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const [embedCode, setEmbedCode] = useState("");
  const script = `<script src="https://sugarcaneai.dev/cube-embed.js" type="text/javascript" async></script>`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const anchorJSX = `<a data-cube="" href="${window.location.href}">TRY NOW</a>`;
      setEmbedCode(anchorJSX);
    }
  }, []);

  function copyEmbedCodeToClipboard() {
    navigator.clipboard.writeText(embedCode);
    toast.success("Copied");
  }

  function copyScriptPathToClipboard() {
    navigator.clipboard.writeText(script);
    toast.success("Copied");
  }

  const getEmbedCode = () => {
    return (
      <Dialog open={isOpen} onClose={handleClose} maxWidth={"md"}>
        <Stack sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component="h2"
            style={{ flex: 1, margin: 0 }}
          >
            Embed Sugar Cube
          </Typography>
          <Typography
            variant="subtitle1"
            component="h4"
            style={{ flex: 1, margin: 0 }}
          >
            Follow the steps mentioned below to embed sugar cube in your project
          </Typography>
        </Stack>
        <Typography p={2}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            Include the given js script in your index.html file as:
            <Button
              id="copy-to-clipboard"
              style={{ cursor: "pointer" }}
              startIcon={<CopyIcon />}
              onClick={copyScriptPathToClipboard}
            ></Button>
          </Box>
          <CodeHighlight code={script} language="markdown" />
        </Typography>
        <Typography p={2}>
          Include the given jsx snippet where you want to embed the sugar cube:
          <Button
            id="copy-to-clipboard"
            style={{ cursor: "pointer" }}
            startIcon={<CopyIcon />}
            onClick={copyEmbedCodeToClipboard}
          ></Button>
          <CodeHighlight code={embedCode} language="jsx" />
        </Typography>
      </Dialog>
    );
  };

  return (
    <div>
      <Tooltip title="Embed Cube" sx={{ ml: 1 }}>
        <CodeIcon onClick={handleOpen} />
      </Tooltip>
      {getEmbedCode()}
    </div>
  );
};

export default SugarCubeEmbed;
