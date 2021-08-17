import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { SatelliteModal } from "./SatelliteModal/SatelliteModal";
import { SatelliteCollection } from "../api/satellite";
import { getSatID, getSatName } from "./util/satelliteDataFuncs";
import {
  Container,
  Button,
  Grid,
  makeStyles,
  Typography,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@material-ui/core";

import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { SatelliteSchemaAccordion } from "./SatelliteModal/SatelliteSchemaAccordion";

const useStyles = makeStyles((theme) => ({
  satellitecontainer: {
    marginTop: "60px",
  },
  tableHead: {
    bckgroundColor: theme.palette.grey[700],
  },
  tableNameCol: {
    width: "25%",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  spinner: {
    color: theme.palette.text.primary,
  },
}));

const newSatValues = {
  noradID: "",
};

export const SatellitesTable = () => {
  const classes = useStyles();
  const columns = [
    {
      headerAlign: "center",
      field: "id",
      headerName: "NORAD ID",
      width: 150,
    },
    {
      headerAlign: "center",
      field: "firstName",
      headerName: "NAME(S)",
      width: 150,
      editable: true,
    },
  ];
  // const rows = [
  //   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  //   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  //   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  //   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  //   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  //   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  //   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  //   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  //   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  // ];

  const [showModal, setShowModal] = useState(false);
  const [newSat, setNewSat] = useState(true);
  const [initialSatValues, setInitialSatValues] = useState(newSatValues);

  const [sats, satsIsLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const sats = SatelliteCollection.find().fetch();
    return [sats, !sub.ready()];
  });

  const [schemas, schemasIsLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const schemas = SatelliteCollection.find().fetch();
    return [schemas, !sub.ready()];
  });

  const handleAddNewSatellite = () => {
    setNewSat(true);
    setShowModal(true);
    setInitialSatValues(newSatValues);
  };

  const handleRowClick = (schemaObject) => {
    setNewSat(false);
    setShowModal(true);
    setInitialSatValues(schemaObject);
  };

  return (
    <>
      <DataGrid
        style={{ height: 410, width: "100%" }}
        columns={columns}
        rows={rows}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        components={{
          Toolbar: GridToolbar,
        }}
      />
      <React.Fragment>
        <Container className={classes.satellitecontainer} maxWidth="md">
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs>
              <Typography variant="h3">Satellites</Typography>
            </Grid>
            <Grid container item xs justify="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddNewSatellite}
              >
                + Add New Satellite
              </Button>
            </Grid>
          </Grid>
          <Typography
            gutterBottom
            variant="body2"
            style={{ marginBottom: 25, marginTop: 10 }}
          >
            Each <strong>satellite</strong> in the catalogue contains a number
            of fields based on schemas defined on the next page.
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="Satellite table">
              <TableHead>
                <TableRow color="secondary">
                  <TableCell className={classes.tableNameCol}>
                    <strong>NORAD ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>NAME(S)</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {satsIsLoading && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <CircularProgress className={classes.spinner} />
                    </TableCell>
                  </TableRow>
                )}
                {!satsIsLoading &&
                  sats.map((satellite, i) => (
                    <TableRow
                      key={`sat-row-${i}`}
                      className={classes.tableRow}
                      onClick={() => handleRowClick(satellite)}
                    >
                      <TableCell
                        key={`sat-name-${i}`}
                        className={classes.tableNameCol}
                      >
                        {getSatID(satellite)}
                      </TableCell>
                      <TableCell key={`sat-desc-${i}`}>
                        {satellite.names.map((name) => name.names).join(", ")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <SatelliteModal
          show={showModal}
          newSat={newSat}
          initValues={initialSatValues}
          handleClose={() => setShowModal(false)}
        />
      </React.Fragment>
    </>

    // <Container className="pt-5">
    //   <div className="d-flex justify-content-between">
    //     <h2>Satellites</h2>
    //   </div>
    //   <p>Each Satellite in the catalogue contains a number of Schemas (defined on the next page). Feel free to browse around!</p>
    //   <BTable {...getTableProps()} striped bordered hover variant="dark" responsive>
    //   <thead>
    //       {headerGroups.map(headerGroup => (
    //         <tr {...headerGroup.getHeaderGroupProps()}>
    //           {headerGroup.headers.map(column => (
    //             // Add the sorting props to control sorting. For this example
    //             // we can add them into the header props
    //             <th {...column.getHeaderProps(column.getSortByToggleProps())}>
    //               {column.render('Header')}
    //               {/* Add a sort direction indicator */}
    //               <span>
    //                 {column.isSorted
    //                   ? column.isSortedDesc
    //                     ? ' 🔽'
    //                     : ' 🔼'
    //                   : ''}
    //               </span>
    //             </th>
    //           ))}
    //         </tr>
    //       ))}
    //     </thead>
    //    <tbody {...getTableBodyProps()}>
    //      {rows.map(row => {
    //        prepareRow(row)
    //        return (
    //          <tr {...row.getRowProps()}>
    //            {row.cells.map(cell => {
    //              return (
    //                <td {...cell.getCellProps()} >
    //                  {cell.render('Cell')}
    //                </td>
    //              )
    //            })}
    //          </tr>
    //        )
    //      })}
    //    </tbody>
    //  </BTable>
    // </Container>
  );
};
