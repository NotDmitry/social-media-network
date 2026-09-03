import './style.css';

export interface TableRow {
  rowHeading: string;
  firstDataSlot: string | number;
  secondDataSlot: string | number;
}

export interface TableViewProps {
  caption: string;
  columnHeaders: [string, string, string];
  data: TableRow[];
}

function TableView({ caption, columnHeaders, data }: TableViewProps) {
  return (
    <div className='table-card'>
      <table className='table'>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope='col'>{columnHeaders[0]}</th>
            <th scope='col'>{columnHeaders[1]}</th>
            <th scope='col'>{columnHeaders[2]}</th>
          </tr>
        </thead>

        <tbody>
          {data.map((rowData) => (
            <tr key={rowData.rowHeading}>
              <th scope='row'>{rowData.rowHeading}</th>
              <td>{rowData.firstDataSlot}</td>
              <td>{rowData.secondDataSlot}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
