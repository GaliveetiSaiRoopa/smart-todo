import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

interface Props {
  label?: String;
  name: any;
  value?: any;
  handleChange?: any;
  options: any;
  bgColor?: string;
  height?: any;
}

const SelectInput: React.FC<Props> = ({
  label,
  options,
  value,
  name,
  handleChange,
  bgColor,
  height,
}) => {
  return (
    <Box sx={{ minWidth: 180, textAlign: "center" }}>
      <FormControl fullWidth>
        <InputLabel
          id="select-label"
          sx={{
            fontSize: "16px",
            color: "#000000",
            textAlign: "center",
          }}
        >
          {label}
        </InputLabel>
        <Select
          labelId="select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          name={name}
          onChange={handleChange}
          sx={{
            textAlign: "left",
            borderRadius: "8px",
            height: height || "50px",
            background: bgColor || "#FFFFFF",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000000",
            },
            color: "#000000",
          }}
        >
          {options.length > 0 ? (
            options.map((item: any) => (
              <MenuItem value={item?.name || item?.id}>{item?.name}</MenuItem>
            ))
          ) : (
            <p>No data found...</p>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectInput;
