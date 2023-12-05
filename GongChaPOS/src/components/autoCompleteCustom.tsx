/**
 * @file autoCompleteCustom.tsx
 * @description Custom AutoComplete component for the Gong Cha POS project.
 */
import "./components.css"
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

/**
 * @interface AutoCompleteCustomProps
 * @description Interface for the props of the AutoCompleteCustom component.
 */
interface AutoCompleteCustomProps{
  data: string[];
  label: string;
  freeSolo?: boolean;
  required?: boolean; // Optional prop for required validation
  handleChange: (value: string) => void;
  onSelectItem?: (value: string) => void;
}

/**
 * @function AutoCompleteCustom
 * @description Custom AutoComplete component with additional styling and functionality.
 * @param {AutoCompleteCustomProps} props - Props for configuring the AutoCompleteCustom component.
 * @returns {JSX.Element} Rendered AutoCompleteCustom component.
 */
function AutoCompleteCustom({data, label, handleChange, freeSolo = false, required = false, onSelectItem}: AutoCompleteCustomProps) {
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
          handleChange(newValue);
          onSelectItem?.(newValue); // Call onSelectItem if it's provided
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
          fontSize: 25,
        },
        '& .MuiAutocomplete-endAdornment': {
          // Center the arrow vertically
          transform: 'translate(0, -15px)', // Center the label vertically
        },
        "& .MuiSvgIcon-root > path": {
          color: 'black', // Set the icon color to black
          
        },
        "& .MuiSvgIcon-root": {
          fontSize: 40,
        },
      }}
    />
  );
}

export default AutoCompleteCustom
