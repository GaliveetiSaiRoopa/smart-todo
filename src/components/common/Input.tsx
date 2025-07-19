import { TextField } from "@mui/material";
import React from "react";

const Input = ({
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
}: any) => {
  return (
    <div className={`${width}`}>
      <TextField
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
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            height: "46px",
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

export default Input;
