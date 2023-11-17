import "./components.css"
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface AutoCompleteCustomProps{
  data: string[];
  label: string;
  handleSelect: (value: string) => void;
}

function AutoCompleteCustom({data, label, handleSelect}: AutoCompleteCustomProps) {
  return (
    <Autocomplete
      disablePortal
      options={data.map((item: any) => item.menuitemname)}
      filterOptions={(options, { inputValue }) => {
        const match = inputValue.toLowerCase();
        return options.filter((option) =>
          option.toLowerCase().startsWith(match)
        );
      }}
      onChange={(_event, newValue) => {
        // Update the state with the new value
        handleSelect(newValue);
      }}
      className="comboBox"
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputLabelProps={{
            style: {
              fontSize: 30, // Adjust as needed
              fontFamily: "Amerigo BT"
            },
          }}
          InputProps={{
            ...params.InputProps,
            style: { fontSize: 30, color: "black", fontFamily: "Amerigo BT" }, // Style for the input text
          }}
        />
      )}
      sx={{
        "& + .MuiAutocomplete-popper .MuiAutocomplete-option": {
          color: "black !important",
          fontSize: 20,
        },
        '& .MuiAutocomplete-endAdornment': {
          // Center the arrow vertically
          transform: 'translate(0, -15px)', // Center the label vertically
        },
        // Add other styles as needed
      }}
    />
  );
}

export default AutoCompleteCustom