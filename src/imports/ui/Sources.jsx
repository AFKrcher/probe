import React, { useState } from 'react';
import { useTable } from 'react-table';
import { useTracker } from 'meteor/react-meteor-data';
import { SchemaCollection } from '../api/schema';
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';
import Container from "react-bootstrap/container";
import BTable from "react-bootstrap/table";
import Button from 'react-bootstrap/Button';

export const Sources = () => {
  const [showModal, setShowModal] = useState(false);

  const schema = useTracker(() => {
    return SchemaCollection.find().fetch();
  });

  const data = React.useMemo(() => schema, [schema]);
  
  const columns = React.useMemo(
        (schema) => schema.map(x=>{
        return {
            Header : x.name,
            accessor : x.name
        }
    }), [schema]
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
        <h2>Data Sources</h2>
      </div>
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