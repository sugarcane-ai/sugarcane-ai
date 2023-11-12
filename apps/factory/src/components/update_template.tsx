import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import {
  createTemplateInput,
  CreateTemplateInput,
} from "~/validators/prompt_template";
import { FormDropDownInput } from "./form_components/formDropDownInput";
import toast from "react-hot-toast";
interface Props {
  openEditTemplate: boolean;
  setOpenEditTemplate: React.Dispatch<React.SetStateAction<boolean>>;
  updateTemplate: () => void;
  ptId: string;
}

const UpdateTemplate = (props: Props) => {
  const [templateId, setTemplateId] = useState<string | undefined>("");
  const [defaultModelType, setDefaultModelType] = useState<
    "TEXT2TEXT" | "TEXT2IMAGE" | undefined
  >("TEXT2IMAGE");

  // zod Schema
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateInput),
  });

  api.prompt.getTemplate.useQuery(
    {
      id: `${props.ptId}`,
    },
    {
      onSuccess(items) {
        console.log(items);
        reset({
          name: items?.name,
          description: items?.description,
          promptPackageId: items?.promptPackageId,
          modelType: items?.modelType,
        });
        setTemplateId(items?.id);
        setDefaultModelType(items?.modelType);
      },
    },
  );

  const mutation = api.prompt.updateTemplate.useMutation();

  const handleClose = () => {
    props.setOpenEditTemplate(false);
  };

  const updateTemplate = (data: CreateTemplateInput) => {
    console.log(data);
    const input = {
      id: templateId!,
      name: data.name,
      description: data.description,
    };
    mutation.mutate(input, {
      onSuccess() {
        handleClose();
        toast.success("Template Updated Successfully");
      },
      onError(error) {
        console.log(error);
      },
    });
  };
  const disabledController = true;
  return (
    <Box>
      <Dialog
        open={props.openEditTemplate}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography>New Prompt Template</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            {/* Model Type */}
            <FormDropDownInput
              name="modelType"
              control={control}
              label="Model Type"
              defaultValue={defaultModelType}
              disable={disabledController}
            />

            {/* name */}
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField variant="outlined" {...register("name")} disabled />
            </FormControl>

            {/* description */}
            <FormControl>
              <FormLabel>Description</FormLabel>
              <TextField variant="outlined" {...register("description")} />
            </FormControl>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button size="small" onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={handleSubmit(updateTemplate)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateTemplate;
