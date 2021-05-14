import React from 'react';
import { useTable, useSortBy} from 'react-table';
import { useTracker } from 'meteor/react-meteor-data';
import { SatelliteCollection } from '../api/satellite';
import Container from "react-bootstrap/container";
import BTable from "react-bootstrap/table";

 export const SatellitesTable = () => {
  const sat = useTracker(() => {
    return SatelliteCollection.find().fetch();
  });

  let format = (sats)=>{
    return sats.map(x=>{
      return {
        "noradID" : x.noradID,
        "names" : x.names.map(n=>n.names).join(", ")
      }
    });
  };

  const data = React.useMemo( () => format(sat), []); //instead of [] use format(sat) to handle refreshses, but causes other bugs
 
   const columns = React.useMemo(
     () => [
      {
        Header: 'Norad Id',
        accessor: 'noradID',
      },
      {
         Header: 'Name(s)',
         accessor: 'names',
      }
     ],
     []
   );
 
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ columns, data }, useSortBy )
 
   return (
    <Container className="pt-5">
      <div className="d-flex justify-content-between">
        <h2>Satellites</h2>
      </div>
      <p>Each Satellite in the catalogue contains a number of Schemas (defined on the next page). Feel free to browse around!</p>
      <BTable {...getTableProps()} striped bordered hover variant="dark" responsive>
      <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td {...cell.getCellProps()} >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </BTable>
    </Container>
   )
 }