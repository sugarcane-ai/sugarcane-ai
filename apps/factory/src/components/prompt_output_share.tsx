import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
//import { toPng } from "html-to-image";
import Box from "@mui/material/Box";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import PromptCompletion from "./prompt_completion";
import Footer from "./footer";

const PromptOutputShare = async ({
  output,
  modelType,
}: {
  output: string;
  modelType: ModelTypeType;
}) => {
  const parser = new DOMParser();
  const htmlString = renderToStaticMarkup(
    <>
      <Box
        sx={{
          backgroundColor: "var(--sugarcube-component-bg-color)",
          color: "white",
          padding: "1rem 1rem",
          borderRadius: "0.5rem",
        }}
      >
        <PromptCompletion
          modelType={modelType}
          output={output}
          imgClassName={"h-100 w-100 object-fill"}
          textAnimation={true}
        />
      </Box>
      <Footer />
    </>,
  );
  const html = parser.parseFromString(htmlString, "text/html").body;
  // const png = await toPng(html);
  // // .then(
  // //   function (dataUrl) {
  // //   download(dataUrl, "my-node.png");
  // // })
  // console.log(htmlString);
  // console.log(html);
  // console.log(png);
  // FS.writeFile("image.png", png);
};

export default PromptOutputShare;
