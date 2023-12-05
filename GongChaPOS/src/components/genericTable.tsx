import "./components.css";
// Define props for the GenericTable component
/**
 * GenericTableProps Interface
 *
 * Interface defining the props for the GenericTable component.
 *
 * @interface
 * @template T - The type of data that the table will display.
 *
 * @property {T[]} data - An array of data to be displayed in the table.
 * @property {Object[]} columns - An array of column objects with keys and headers.
 * @property {keyof T} columns.key - The key of the data object corresponding to the column.
 * @property {string} columns.header - The header text for the column.
 * @property {string} [className] - An optional class name for additional styling.
 */
interface GenericTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
  }[];
  className?: string;
  
}

/**
 * GenericTable Component
 *
 * A reusable table component for displaying data with customizable columns.
 *
 * @component
 * @example
 * // Example usage with TypeScript:
 * const data = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
 * const columns = [{ key: 'id', header: 'ID' }, { key: 'name', header: 'Name' }];
 * <GenericTable data={data} columns={columns} className="customTable" />
 *
 * @param {GenericTableProps<T>} props - The properties of the GenericTable component.
 * @param {T[]} props.data - An array of data to be displayed in the table.
 * @param {Object[]} props.columns - An array of column objects with keys and headers.
 * @param {keyof T} props.columns.key - The key of the data object corresponding to the column.
 * @param {string} props.columns.header - The header text for the column.
 * @param {string} [props.className] - An optional class name for additional styling.
 *
 * @returns {JSX.Element} The rendered GenericTable component.
 */
function GenericTable<T>({ data, columns, className }: GenericTableProps<T>) {

  return (
    <div className="inventoryContainer">
      <table className={`inventoryTable ${className}`} aria-labelledby="inventoryTableLabel" aria-rowcount={data.length} aria-colcount={columns.length}>
        <caption id="inventoryTableLabel" className="visually-hidden">Inventory Details</caption>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col">{column.header}</th> // Use scope="col" for column headers
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} aria-rowindex={rowIndex + 1}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{String(item[column.key])}</td>
                ))}
              </tr>
            ))
          ) : (
            // When there's no data, span the empty cell across all columns
            <tr>
              <td colSpan={columns.length} className="noDataCell">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GenericTable;
