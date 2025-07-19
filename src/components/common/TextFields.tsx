import { TextField } from "@mui/material";
import React from "react";

const TextFields = ({
  width,
  disabled,
  type,
  name,
  value,
  error,
  helperText,
  label,
  readOnly,
  handleChange,
  rows,
}: any) => {
  return (
    <div className={`${width}`}>
      <TextField
        id="outlined-multiline-static"
        disabled={disabled}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        error={error}
        helperText={helperText}
        label={label}
        variant="outlined"
        inputProps={{ readOnly, autoComplete: "off" }}
        multiline
        rows={rows}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            borderRadius: "8px",
            "& > fieldset": {
              borderColor: "#000000",
            },
          },
          "& .MuiFormLabel-root": {
            marginTop: "-3px",
            // fontWeight: 500,
            color: "#000000",
          },
        }}
      />
    </div>
  );
};

export default TextFields;
