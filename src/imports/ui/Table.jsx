import React from 'react';
import { useTable } from 'react-table';
import { useTracker } from 'meteor/react-meteor-data';
import { SatelliteCollection } from '../api/satellite';
import Container from "react-bootstrap/container";
import BTable from "react-bootstrap/table";

 export const Table = () => {
  const sat = useTracker(() => {
    return SatelliteCollection.find().fetch();
  });

   const data = React.useMemo(() => sat, [sat]);
 
   const columns = React.useMemo(
     () => [
       {
         Header: 'Name',
         accessor: 'name',
       },
       {
        Header: 'Norad Id',
        accessor: 'noradID',
      },
     ],
     []
   );
 
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ columns, data })
 
   return (
    <Container className="pt-5">
      <BTable {...getTableProps()} striped bordered hover variant="dark" responsive>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th {...column.getHeaderProps()} >
                 {column.render('Header')}
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