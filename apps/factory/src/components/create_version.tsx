import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { PackageOutput as pp } from "~/validators/prompt_package";
import type { TemplateOutput as pt } from "~/validators/prompt_template";
import { VersionOutput as pv } from "~/validators/prompt_version";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { parse, valid } from "semver";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import ForkRightIcon from "@mui/icons-material/ForkRight";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTextInput } from "./form_components/formTextInput";
import type { CreateVersionInput } from "~/validators/prompt_version";
import { createVersionInput } from "~/validators/prompt_version";
import { error } from "console";

CreateVersion.defaultProps = {
  icon: <AddCircleIcon />,
  forkedFromId: null,
  v: "0.0.1",
};
export function CreateVersion({
  pp,
  pt,
  onCreate,
  icon,
  forkedFromId,
  v,
}: {
  pp: pp;
  pt: pt;
  icon?: React.JSX.Element;
  v: string;
  onCreate: Function;
  forkedFromId: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // const [version, setVersion] = useState(v);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateVersionInput>({
    defaultValues: {
      version: v,
      promptPackageId: pp?.id,
      promptTemplateId: pt?.id,
      forkedFromId: forkedFromId,
      moduleType: pt?.modelType,
    },
    resolver: zodResolver(createVersionInput),
  });

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const pvCreateMutation = api.prompt.createVersion.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      console.log(errorData);
      setError("version", {
        type: "manual",
        message: errorData.error?.message,
      });
    },
    onSuccess: (pv) => {
      if (pv !== null) {
        onCreate(pv);
        handleClose();
        toast.success(`Version ${pv.version} Created Successfully`);
      }
    },
  });

  const onFormSubmit = (data: CreateVersionInput) => {
    const response = {
      promptPackageId: pp?.id,
      promptTemplateId: pt?.id,
      version: data.version,
      forkedFromId: forkedFromId,
      moduleType: pt?.modelType,
    };
    console.log(response);
    pvCreateMutation.mutate(response as CreateVersionInput);
  };

  return (
    <>
      <Grid component="span">
        {/* <Button
          variant="outlined"
          startIcon={<AddCircleIcon />}
          size="small"
          aria-label="add version"
          onClick={() => setIsOpen(true)}
          color="primary"
        >
          New Version
        </Button> */}
        <IconButton
          size="small"
          aria-label="add template"
          onClick={() => setIsOpen(true)}
          color="primary"
        >
          {forkedFromId ? <ForkRightIcon /> : <AddCircleIcon />}
        </IconButton>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm">
        <DialogTitle>New Prompt Version</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormTextInput
              name="version"
              control={control}
              label="Version"
              error={!!errors.version}
              helperText={errors.version?.message}
            />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button size="small" onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleSubmit(onFormSubmit)}
            variant="outlined"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
