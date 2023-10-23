import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { packageVisibility } from "~/validators/base";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreatePackageInput } from "~/validators/prompt_package";
import { createPackageInput } from "~/validators/prompt_package";
import { FormTextInput } from "./form_components/formTextInput";
import { FormRadioInput } from "./form_components/formRadioInput";

export function CreatePackage({
  onSubmit,
  status,
  customError, // customError,
}: {
  onSubmit: Function;
  status: string;
  customError: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreatePackageInput>({
    defaultValues: {
      name: "",
      description: "",
      visibility: packageVisibility.enum.PUBLIC,
    },
    resolver: zodResolver(createPackageInput),
  });

  useEffect(() => {
    if (status === "success") {
      handleClose();
    }
  }, [status]);

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onFormSubmit = (data: CreatePackageInput) => {
    try {
      onSubmit(data);
      if (customError) {
        setError("name", { type: "manual", message: customError.error.name });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid container justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={() => setIsOpen(true)}>
          Create
        </Button>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">New Prompt Package</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
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

            <FormRadioInput
              name={"visibility"}
              control={control}
              label="Visibility"
            />
            <div>
              {watch("visibility") === packageVisibility.Enum.PUBLIC ? (
                <span>
                  Anyone on the internet can use this package. You choose who
                  can edit.
                </span>
              ) : (
                <span>You choose who can see and commit to this package.</span>
              )}
            </div>
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
    </>
  );
}
