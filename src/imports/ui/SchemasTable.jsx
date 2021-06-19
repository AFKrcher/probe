import React, { useState } from "react";
import { useTable } from "react-table";
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../api/schema";
import { SchemaModal } from "./SchemaModal/SchemaModal.jsx";
import { SchemaEditModal } from "./SchemaEditModal/SchemaEditModal";
import { Container, Button, Grid, makeStyles, Typography, Table, TableContainer, Paper, TableHead, TableBody, TableRow, TableCell, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  schemacontainer: {
    marginTop: '60px',
  },
  tableHead: {
    bckgroundColor: theme.palette.grey[700],
  },
  tableNameCol: {
    width: '25%',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    }
  },
  spinner: {
    color: theme.palette.text.primary,
  }
}));

const newSchemaValues = {
  name: "", 
  description: "", 
  fields: [
    { 
      name: "reference",
      type: "string",
      allowed: []
    }
  ]};

export const SchemasTable = () => {
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);
  const [newSchema, setNewSchema] = useState(true);
  const [initialSchemaValues, setInitialSchemaValues] = useState(newSchemaValues)

  const [showEditModal, setShowEditModal] = useState(false);
  const [schemaEditingObject, setSchemaEditingObject] = useState(null);

  const [schemas, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe('schemas');
    const schemas = SchemaCollection.find().fetch();
    return [schemas, !sub.ready()]
  });

  const handleAddNewSchema = () => {
    setNewSchema(true);
    setShowModal(true);
    setInitialSchemaValues(newSchemaValues);
  }

  const handleRowClick = (schemaObject) => {
    setNewSchema(false);
    setShowModal(true);
    setInitialSchemaValues(schemaObject);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSchemaEditingObject(null);
  };

  return (
    <React.Fragment>
      <Container className={classes.schemacontainer} maxWidth="md">
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs>
            <Typography variant="h3">Schemas</Typography>
          </Grid>
          <Grid container item xs justify="flex-end">
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAddNewSchema}
            >+ Add New Schema</Button>
          </Grid>
        </Grid>
        <Typography gutterBottom variant="body2">
            Each piece of data you want to store has its own <strong>schema</strong>
        </Typography>
        <Typography gutterBottom variant="body2">
            Each <strong>schema</strong> has a reference (where the data was found), 
            a description (describing what the data is), and a number of data fields 
            (that contain the actual information)
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="Schema table">
            <TableHead>
              <TableRow color="secondary">
                <TableCell className={classes.tableNameCol}>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && 
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <CircularProgress className={classes.spinner} />
                </TableCell>
              </TableRow>
              }
              {!isLoading && schemas.map((schema, i) => (
                <TableRow key={`schema-row-${i}`} className={classes.tableRow} onClick={() => handleRowClick(schema)}>
                  <TableCell key={`schema-name-${i}`} className={classes.tableNameCol}>{schema.name}</TableCell>
                  <TableCell key={`schema-desc-${i}`}>{schema.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <SchemaModal 
        show={showModal} 
        newSchema={newSchema} 
        initValues={initialSchemaValues} 
        handleClose={() => setShowModal(false)} 
      />
    </React.Fragment>

    // <BContainer className="py-5">
    //   {console.log(schemas)}
    //   <div className="d-flex justify-content-between">
    //     <h2>Schemas</h2>
    //     <Button variant="dark mb-2" onClick={() => setShowModal(true)}>
    //       + Add New Schema
    //     </Button>
    //   </div>
    //   <p>Each peice of data you want to store has its own Schema.</p>
    //   <p>
    //     Each Schema has a <span className="font-weight-bold">reference</span>{" "}
    //     (where the data was found), a{" "}
    //     <span className="font-weight-bold">description</span> (describing what
    //     the data type is) and a number of{" "}
    //     <span className="font-weight-bold">data fields</span> (that contain the
    //     actual information).
    //   </p>
    //   <BTable
    //     {...getTableProps()}
    //     striped
    //     bordered
    //     hover
    //     variant="dark"
    //     responsive
    //   >
    //     <thead>
    //       {headerGroups.map((headerGroup) => (
    //         <tr {...headerGroup.getHeaderGroupProps()}>
    //           {headerGroup.headers.map((column) => (
    //             <th {...column.getHeaderProps()}>{column.render("Header")}</th>
    //           ))}
    //         </tr>
    //       ))}
    //     </thead>
    //     <tbody {...getTableBodyProps()}>
    //       {rows.map((row) => {
    //         prepareRow(row);
    //         console.log(row);
    //         return (
    //           <tr
    //             onClick={() => handleRowClick(row.original)}
    //             {...row.getRowProps()}
    //           >
    //             {row.cells.map((cell) => {
    //               return (
    //                 <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
    //               );
    //             })}
    //           </tr>
    //         );
    //       })}
    //     </tbody>
    //   </BTable>
    //   <SchemaEditModal
    //     editSchema={schemaEditingObject}
    //     show={showEditModal}
    //     handleClose={handleCloseEditModal}
    //   />
    //   <SchemaModal
    //     show={showModal}
    //     handleClose={() => {
    //       setShowModal(false);
    //     }}
    //   />
    // </BContainer>
  );
};
