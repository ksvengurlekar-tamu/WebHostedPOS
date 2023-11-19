import "./components.css"
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface AutoCompleteCustomProps{
  data: string[];
  label: string;
  freeSolo?: boolean;
  required?: boolean; // Optional prop for required validation
  handleSelect: (value: string) => void;
}

function AutoCompleteCustom({data, label, handleSelect, freeSolo = false, required = false}: AutoCompleteCustomProps) {
  return (
    <Autocomplete
      disablePortal
      options={data}
      freeSolo={freeSolo}
      filterOptions={(options, { inputValue }) => {
        const match = inputValue.toLowerCase();
        return options.filter((option) =>
          option.toLowerCase().startsWith(match)
        );
      }}
      onInputChange={(_event, newValue) => {
        // Update the state with the new value
        if (newValue !== null) {
          handleSelect(newValue);
        }
      }}
      className="comboBox"
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
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
        "& .MuiInputBase-root": {
          backgroundColor: 'white', // Set the background color to white
          // Add other styles for the input base as needed
        },
        "& + .MuiAutocomplete-popper .MuiAutocomplete-option": {
          color: "black !important",
          fontSize: 20,
        },
        '& .MuiAutocomplete-endAdornment': {
          // Center the arrow vertically
          transform: 'translate(0, -15px)', // Center the label vertically
        },
        "& .MuiSvgIcon-root > path": {
          color: 'black', // Set the icon color to black
        },
      }}
    />
  );
}

export default AutoCompleteCustom