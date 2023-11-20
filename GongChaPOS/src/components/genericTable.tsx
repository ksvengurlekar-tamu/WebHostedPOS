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

  const columnCount = columns.length;
  return (
    <div className="inventoryContainer">
      <table className={`inventoryTable ${className}`}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <td key={columnIndex}>{String(item[column.key])}</td>
                ))}
              </tr>
            ))
          ) : (
            // Render "No data" row when there is no data
            <tr>
              <td colSpan={columnCount} className="noDataCell">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GenericTable;