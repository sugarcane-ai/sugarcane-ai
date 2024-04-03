import React, { useState } from "react";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Typography, Grid, Chip, CardActionArea } from "@mui/material";
import { CreateCopilot } from "~/components/create_copilot";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { CopilotListOutput, CopilotOutput } from "~/validators/copilot";

const CopilotHome = () => {
  const [status, setStatus] = useState("");
  const [customError, setCustomError] = useState({});
  const [copilots, setCopilots] = useState<CopilotListOutput>([]);

  const handleCopilotCreationSuccess = (createdCopilot: CopilotOutput) => {
    setStatus("success");
    toast.success("Copilot created successfully");
    setTimeout(() => {
      setStatus("");
    }, 3000);
    setCustomError({});
  };

  const mutation = api.copilot.createCopilot.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: (createdCopilot) => {
      if (createdCopilot !== null) {
        setCustomError({});
        handleCopilotCreationSuccess(createdCopilot);
      } else {
        toast.error("Something went wrong, Please try again");
      }
    },
  });

  api.copilot.getCopilots.useQuery(
    {},
    {
      onSuccess(data: CopilotListOutput) {
        setCopilots([...data]);
      },
    },
  );

  return (
    <>
      {copilots && copilots.length > 0 ? (
        <>
          <CreateCopilot
            onSubmit={mutation.mutate}
            status={status}
            customError={customError}
            copilotsExists={true}
          ></CreateCopilot>
          <Copilots copilots={copilots} setCopilots={setCopilots} />
        </>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "80vh" }}
        >
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h5"
              // fontSize={18}
              padding={3}
              // fontWeight={700}
            >
              Create your first Copilot
            </Typography>
            <CreateCopilot
              onSubmit={mutation.mutate}
              status={status}
              customError={customError}
              copilotsExists={false}
            ></CreateCopilot>
          </Grid>
        </Grid>
      )}
    </>
  );
};

const Copilots = ({
  copilots,
  setCopilots,
}: {
  copilots: CopilotListOutput;
  setCopilots: React.Dispatch<React.SetStateAction<CopilotListOutput>>;
}) => {
  return (
    <Grid container spacing={1} paddingTop={2}>
      {copilots.map((copilot, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card title={`${copilot?.description}`}>
            <CardActionArea href={``}>
              <CardHeader
                title={copilot?.name}
                action={
                  <Chip sx={{ mr: 2 }} size="small" label={copilot?.status} />
                }
              />

              <CardContent>
                <Typography
                  sx={{
                    height: "3em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {copilot?.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

CopilotHome.getLayout = getLayout;
export default CopilotHome;
