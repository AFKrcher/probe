import React, { useState } from 'react';
import { useTable } from 'react-table';
import { useTracker } from 'meteor/react-meteor-data';
import { SchemaCollection } from '../api/schema';
import { SchemaModal } from './SchemaModal/SchemaModal.jsx';
import Container from "react-bootstrap/container";
import BTable from "react-bootstrap/table";
import Button from 'react-bootstrap/Button';
import { SchemaEditModal } from './SchemaEditModal/SchemaEditModal';

 export const SchemasTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [schemaEditingObject, setSchemaEditingObject] = useState();

  const schemas = useTracker(() => {
    return SchemaCollection.find().fetch();
  });

   const data = React.useMemo(() => schemas, [schemas]);
 
   const columns = React.useMemo(
     () => [
       {
         Header: 'Name',
         accessor: 'name',
       },
       {
        Header: 'Description',
        accessor: 'description',
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

   const handleRowClick = (schemaObject) => {
      setSchemaEditingObject(schemaObject);
      setShowEditModal(true);
   }

   const handleCloseEditModal = () => {
     setShowEditModal(false);
     setSchemaEditingObject(null);
   }
 
   return (
    <Container className="pt-5">
      {console.log(schemas)}
      <div className="d-flex justify-content-between">
        <h2>Schemas</h2>
        <Button variant="dark mb-2" onClick={() => setShowModal(true)}>Add Schema</Button>
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
           console.log(row);
           return (
             <tr onClick={() => handleRowClick(row.original)} {...row.getRowProps()}>
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
     <SchemaEditModal editschema={schemaEditingObject} show={showEditModal} handleClose={handleCloseEditModal} />
     <SchemaModal show={showModal} handleClose={() => { setShowModal(false) }} />
    </Container>
   )
 }