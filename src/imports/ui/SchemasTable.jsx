import React, { useState } from 'react';
import { useTable } from 'react-table';
import { useTracker } from 'meteor/react-meteor-data';
import { SchemaCollection } from '../api/schema';
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';
import Container from "react-bootstrap/container";
import BTable from "react-bootstrap/table";
import Button from 'react-bootstrap/Button';

 export const SchemasTable = () => {
  const [showModal, setShowModal] = useState(false);

  const sat = useTracker(() => {
    return SchemaCollection.find().fetch();
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
      <div className="d-flex justify-content-between">
        <h2>Schemas</h2>
        <Button variant="dark mb-2" onClick={() => setShowModal(true)}>+ Add New Schema</Button>
      </div>
      <p>Each peice of data you want to store has its own Schema.</p>
      <p>Each Schema has a <span className="font-weight-bold">reference</span> (where the data was found), a <span className="font-weight-bold">description</span> (describing what the data type is) and a number of <span className="font-weight-bold">data fields</span> (that contain the actual information).</p>
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
     <SchemaModal show={showModal} handleClose={() => { setShowModal(false) }} />
    </Container>
   )
 }