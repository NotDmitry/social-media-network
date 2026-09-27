import './style.css';

export interface TableRow {
  rowHeading: string;
  dataSlots: (string | number)[];
}

export interface TableViewProps {
  caption: string;
  columnHeaders: string[];
  data: TableRow[];
}

function TableView({ caption, columnHeaders, data }: TableViewProps) {
  return (
    <div className='table-card'>
      <table className='table'>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columnHeaders.map((columnHeader) => (
              <th scope='col' key={columnHeader}>{columnHeader}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((rowData) => (
            <tr key={rowData.rowHeading}>
              <th scope='row'>{rowData.rowHeading}</th>
              {rowData.dataSlots.map((dataSlot, dataSlotIndex) => (
                <td key={dataSlotIndex}>{dataSlot}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
