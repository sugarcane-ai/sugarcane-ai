import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTemplateInput } from "~/validators/prompt_template";
import { createTemplateInput } from "~/validators/prompt_template";
import { FormTextInput } from "./form_components/formTextInput";
import { FormDropDownInput } from "./form_components/formDropDownInput";
import EditIcon from "@mui/icons-material/Edit";
import UpdateTemplate from "./update_template";
export function CreateTemplate({
  pp,
  onCreate,
  sx,
  status,
  customError,
  length,
  ptId,
}: {
  pp: pp;
  onCreate: Function;
  sx?: any;
  status: string;
  customError: any;
  length: number;
  ptId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openEditTemplate, setOpenEditTemplate] = useState<boolean>(false);
  const [defaultModelType, setDefaultModelType] = useState<
    "TEXT2TEXT" | "TEXT2IMAGE" | undefined
  >("TEXT2TEXT");
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<CreateTemplateInput>({
    defaultValues: {
      name: "",
      description: "",
      modelType: ModelTypeSchema.enum.TEXT2TEXT,
      promptPackageId: pp?.id,
    },
    resolver: zodResolver(createTemplateInput),
  });

  useEffect(() => {
    if (customError && customError.error) {
      setError("name", { type: "manual", message: customError.error?.name });
    } else {
      clearErrors("name");
    }
  }, [customError, setError, clearErrors]);

  useEffect(() => {
    if (status === "success") {
      handleClose();
    }
  }, [status]);

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onFormSubmit = (data: CreateTemplateInput) => {
    try {
      onCreate?.(data);
    } catch (err) {
      console.log(err);
    }
  };

  // disable variable to make Select Model type disable
  const disableValue = false;

  return (
    <Box component="span" sx={{}}>
      <Grid component="span">
        <Grid container>
          <Grid item xs={6} md={6} lg={6}>
            <Tooltip title={"Create Template"} placement="top-start">
              <IconButton
                size="small"
                aria-label="add template"
                onClick={() => setIsOpen(true)}
                color="primary"
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          {length > 0 ? (
            <>
              <Grid item xs={6} md={6} lg={6}>
                <Tooltip title={"Edit Template"} placement="top-start">
                  <IconButton
                    size="small"
                    aria-label="edit template"
                    onClick={() => setOpenEditTemplate(!openEditTemplate)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>

      {openEditTemplate === true ? (
        <>
          <UpdateTemplate
            openEditTemplate={openEditTemplate}
            setOpenEditTemplate={setOpenEditTemplate}
            ptId={ptId}
          />
        </>
      ) : (
        <></>
      )}

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography>New Prompt Template</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormDropDownInput
              name="modelType"
              control={control}
              label="Model Type"
              defaultValue={defaultModelType}
              disable={disableValue}
            />

            <FormTextInput
              name="name"
              control={control}
              label="Name"
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <FormTextInput
              name="description"
              control={control}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
