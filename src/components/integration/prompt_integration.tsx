import { Username } from "~/validators/base";
import CodeHighlight from "./code_highlight";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import { VersionOutput as pv } from "~/validators/prompt_version";

export const PromptIntegration = ({
  ns,
  pp,
  pt,
  pv,
}: {
  ns: Username;
  pp: pp;
  pt: pt;
  pv: pv;
}) => {
  const identifier = `${ns}/${pp?.name}/${pt?.name || "<template>"}#${
    pv?.version || "latest"
  }`;

  const codeExample = `
  import { SugarcaneAIClient } from "@sugarcane-ai/kitchen-js";
  
  const apiKey = 'your-api-key';
  const client = new SugarcaneAIClient(apiKey);
  
  const template = client.getTemplate("${identifier}");
  console.log(template);
  `;

  return <CodeHighlight code={codeExample} language="typescript" />;
};

PromptIntegration.defaultProps = {
  pt: null,
  pv: null,
};
