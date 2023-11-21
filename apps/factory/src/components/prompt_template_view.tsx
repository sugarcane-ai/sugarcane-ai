import React, { useEffect, useState } from "react";
import Header from "~/components/marketplace/header";
import {
  Container,
  Box,
  Stack,
  Button,
  Checkbox,
  Grid,
  Typography,
  Dialog,
  IconButton,
} from "@mui/material";
import { api } from "~/utils/api";
import { promptEnvironment } from "~/validators/base";
import PromptVariables, { PromptVariableProps } from "./prompt_variables";
import { getUniqueJsonArray, getVariables } from "~/utils/template";
import { GenerateInput, GenerateOutput } from "~/validators/service";
import FormControlLabel from "@mui/material/FormControlLabel";
import PromptOutput from "./prompt_output";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import { useSession, signIn } from "next-auth/react";
import Link from "@mui/material/Link";
const isDev = process.env.NODE_ENV === "development";
import { displayModes, DisplayModes } from "~/validators/base";
import PromptViewArrow from "./prompt_view_arrow";
import { LoadingButton } from "@mui/lab";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Counter from "./counter_responsetime";
import { CreateTemplate } from "./create_template";
import { PackageOutput as pp } from "~/validators/prompt_package";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Footer from "./footer";
import DownloadButtonImg from "./download_button_img";

interface PromptTemplateViewProps {
  username: string;
  packageName: string;
  template: string;
  versionOrEnvironment: string;
}

const PromptTemplateView: React.FC<PromptTemplateViewProps> = ({
  username,
  packageName,
  template,
  versionOrEnvironment,
}) => {
  const { data: session, status } = useSession();
  const [checked, setChecked] = useState(isDev);
  const [pvrs, setVariables] = useState<PromptVariableProps[]>();
  const [pl, setPl] = useState<GenerateOutput>(null);
  const [promptOutput, setPromptOutput] = useState("");
  const [promptPerformance, setPromptPerformacne] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [packageData, setPackageData] = useState<pp>({} as pp);
  const [templateId, setTemplateId] = useState<string>("");
  const handleOpen = () => setIsOpen(true);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = api.cube.getPrompt.useQuery({
    username: username,
    package: packageName,
    template: template,
    versionOrEnvironment: versionOrEnvironment?.toUpperCase(),
  });

  api.prompt.getPackageUsingName.useQuery(
    {
      name: packageName,
    },
    {
      onSuccess(item) {
        setPackageData(item);
      },
    },
  );

  api.prompt.getTemplateUsingName.useQuery(
    {
      templateName: template,
      packageName: packageName,
    },
    {
      onSuccess(item) {
        setTemplateId(item!.id);
      },
    },
  );

  useEffect(() => {
    const variables = getUniqueJsonArray(
      getVariables(data?.template || ""),
      "key",
    );
    setVariables(variables);
  }, [data]);

  const handleVariablesChange = (k: string, v: string) => {
    setVariables((pvrs) => {
      // Step 2: Update the state
      return pvrs?.map((pvr) => {
        if (pvr.key === k) {
          // pvr.value = v;
          console.log(`gPv  ${pvr.key}: ${pvr.value} => ${v}`);
          return { ...pvr, ...{ value: v } };
        }
        return pvr;
      });
    });

    // console.log(`pvrs >>>> ${JSON.stringify(pvrs)}`);
  };

  const generateMutation = api.service.generate.useMutation(); // Make sure to import 'api' and set up the service

  const handleRun = async (e: any) => {
    setIsLoading(true);
    console.log(`running template version ${versionOrEnvironment}`);

    let data: { [key: string]: any } = {};
    for (const item of pvrs as PromptVariableProps[]) {
      data[`${item.type}${item.key}`] = item.value;
    }

    const pl = await generateMutation.mutateAsync(
      {
        username: username,
        package: packageName || "",
        template: template || "",
        versionOrEnvironment: versionOrEnvironment?.toUpperCase() || "",
        isDevelopment: checked,

        data: data,
      } as GenerateInput,
      {
        onSuccess() {
          setIsLoading(false);
        },
        onError() {
          setIsLoading(false);
        },
      },
    );

    console.log(`pl >>>>>>>: ${JSON.stringify(pl)}`);
    if (pl) {
      setPl(pl);
      setPromptOutput(pl.completion);
      setPromptPerformacne({
        latency: pl.latency,
        prompt_tokens: pl.prompt_tokens,
        completion_tokens: pl.completion_tokens,
        total_tokens: pl.total_tokens,
      });
    }
  };

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--sugarhub-main-color)",
      }}
    >
      <Header headerName={"Sugar Cube"} />
      <Box
        sx={{
          padding: "1rem 0rem",
        }}
      >
        <Container className="center">
          <div
            className="dark:border-gray-70  w-full rounded-lg border p-4 shadow sm:p-6"
            style={{ backgroundColor: "var(--sugarhub-tab-color)" }}
          >
            {data || !versionOrEnvironment ? (
              <>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={1.5} sm={1} md={1} lg={1}></Grid>
                    <Grid item xs={9} sm={10} md={10} lg={10}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          color: "var(--sugarhub-text-color)",
                          fontSize: { xs: "2rem", sm: "3rem", lg: "3rem" },
                        }}
                      >
                        {!template ? "" : template.replaceAll("-", " ")}
                      </Typography>
                    </Grid>
                    <Grid item xs={1.5} sm={1} md={1} lg={1}>
                      <IconButton>
                        <WhatsAppIcon
                          sx={{
                            color: "var(--sugarhub-text-color)",
                            fontSize: "2rem",
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container wrap="nowrap" columnSpacing={2}>
                    <Grid item xs={1.3} sm={1} md={1} lg={1}></Grid>
                    <Grid item xs={9.4} sm={10} md={10} lg={10}>
                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                          textAlign: "center",
                          color: "var(--sugarhub-text-color)",
                          wordBreak: "break-word",
                        }}
                      >
                        {data?.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={1.3} sm={1} md={1} lg={1}>
                      <CreateTemplate
                        pp={packageData}
                        onCreate={() => void undefined}
                        status={""}
                        customError={{}}
                        ptId={templateId}
                        cube={true}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ m: 1 }}>
                  {pvrs && (
                    <>
                      {data && (
                        <PromptViewArrow promptTemplate={data?.template} />
                      )}
                      <PromptVariables
                        vars={pvrs}
                        onChange={handleVariablesChange}
                        mode={displayModes.Enum.EDIT}
                        cube={true}
                      />
                    </>
                  )}
                </Box>
                <Stack direction="row" spacing={1} sx={{ p: 1 }}>
                  {isDev && (
                    <FormControlLabel
                      sx={{ color: "var(--sugarhub-text-color)" }}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={handleChange}
                          sx={{
                            color: "var(--button-color-disable)",
                            "&.Mui-checked": {
                              color: "var(--sugarcube-component-bg-color)",
                            },
                          }}
                        />
                      }
                      label="Dummy"
                    />
                  )}
                  <LoadingButton
                    color="success"
                    variant="outlined"
                    onClick={session ? handleRun : handleOpen}
                    disabled={pvrs?.some((v) => v.value === "")}
                    sx={{
                      "&.Mui-disabled": {
                        borderColor: "var(--button-color-disable)",
                        color: "var(--button-color-disable)",
                      },
                      width: "8rem",
                    }}
                    loadingPosition="start"
                    startIcon={<PlayArrowIcon />}
                    loading={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Counter />s
                      </>
                    ) : (
                      <>Run</>
                    )}
                  </LoadingButton>
                  {!session && isOpen && (
                    <Box>
                      <Typography className="mt-2">
                        <Link href="#" onClick={() => void signIn()}>
                          Signup
                        </Link>{" "}
                        to run the task!
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Box sx={{ m: 1 }}>
                  {promptOutput && (
                    <Stack direction="row" spacing={2} sx={{ p: 1 }}>
                      <Grid>
                        <Box padding={2}>
                          <Typography
                            variant="h6"
                            className="mb-5"
                            sx={{ color: "var(--sugarhub-text-color)" }}
                          >
                            Output
                          </Typography>
                          <div
                            style={{
                              flexDirection: "row",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <PromptOutput
                              output={promptOutput}
                              modelType={data?.modelType as ModelTypeType}
                            />
                            {data?.modelType !==
                              ModelTypeSchema.Enum.TEXT2TEXT && (
                              <DownloadButtonImg base64image={promptOutput} />
                            )}
                          </div>
                        </Box>
                      </Grid>
                    </Stack>
                  )}
                </Box>
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    color: "var(--sugarhub-text-color)",
                    textAlign: "center",
                  }}
                >
                  No template found
                </Typography>
              </>
            )}
          </div>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PromptTemplateView;
