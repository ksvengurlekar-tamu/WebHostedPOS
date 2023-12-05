import "./components.css";
// Define props for the GenericTable component
interface GenericTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
  }[];
  className?: string;
  
}

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