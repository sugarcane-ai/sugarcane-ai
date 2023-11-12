import React from "react";
import { Controller } from "react-hook-form";
import { FormControl, FormLabel, Select, MenuItem } from "@mui/material";
import type { FormInputProps } from "./formInputProps";
import { providerModels } from "~/validators/base";

interface Props extends FormInputProps {
  defaultValue: "TEXT2TEXT" | "TEXT2IMAGE" | undefined;
  disable: boolean;
}

export function FormDropDownInput({
  name,
  control,
  label,
  defaultValue,
  disable,
}: Props) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        disabled={disable}
        render={({ field }) => (
          <Select {...field} aria-label={name}>
            {Object.entries(providerModels).map(([modelType, modelConfig]) => (
              <MenuItem
                key={modelType}
                value={modelType}
                disabled={!modelConfig.enabled}
                selected={defaultValue === modelType ? true : false}
              >
                {modelConfig.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}
