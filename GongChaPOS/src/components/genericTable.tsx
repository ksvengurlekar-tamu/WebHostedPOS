import "./components.css";
// Define props for the GenericTable component
interface GenericTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
  }[];
  
}

function GenericTable<T>({ data, columns }: GenericTableProps<T>) {
  return (
    <div className="inventoryContainer">
      <table className="inventoryTable">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td key={columnIndex}>{String(item[column.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GenericTable;