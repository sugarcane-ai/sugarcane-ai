import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { getLayout } from "~/app/layout";
import LabelIcons from "~/components/label_icon";
import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const CopilotShow: NextPageWithLayout = () => {
  const router = useRouter();
  const copilotId = router.query.id as string;
  const { data: copilot } = api.copilot.getCopilot.useQuery({ id: copilotId });

  return (
    <>
      <Box
        sx={{ p: 2, display: "flex", alignItems: "center" }}
        className="w-full"
      >
        <Typography
          variant="h4"
          component="span"
          sx={{ mt: 1, mb: 4, flex: 1 }}
        >
          {`${copilot?.name} copilot`}
        </Typography>
      </Box>
      {copilot && (
        <Box
          sx={{ p: 2, display: "flex", alignItems: "center" }}
          className="w-full"
        >
          <Typography
            variant="h4"
            component="span"
            sx={{ mt: 1, mb: 4, flex: 1 }}
          >
            Token: {copilot?.id}
          </Typography>
        </Box>
      )}
    </>
  );
};

CopilotShow.getLayout = getLayout;

export default CopilotShow;
