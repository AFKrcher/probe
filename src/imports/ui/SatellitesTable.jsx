import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Tooltip,
} from "@material-ui/core";

import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { SatelliteSchemaAccordion } from "./SatelliteModal/SatelliteSchemaAccordion";

const useStyles = makeStyles((theme) => ({
  satelliteContainer: {
    marginTop: 40,
  },
  tableHead: {
    backgroundColor: theme.palette.grey[700],
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
  link: {
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
      field: "names",
      headerName: "NAME(S)",
      width: 250,
      editable: true,
      renderCell: (params) => {
        return (
          <Button
            // key={`sat-row-${i}`}
            className={classes.tableRow}
            onClick={() =>
              handleRowClick(
                SatelliteCollection.find({ noradID: params.id }).fetch()[0]
              )
            }
          >
            {params.value}
          </Button>
        );
      },
    },
  ];
  const [showModal, setShowModal] = useState(false);
  const [newSat, setNewSat] = useState(true);
  const [initialSatValues, setInitialSatValues] = useState(newSatValues);

  const [sats, satsIsLoading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const sats = SatelliteCollection.find().fetch();
    return [sats, !sub.ready()];
  });

  const [rows, setRows] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const rows = SatelliteCollection.find()
      .fetch()
      .map((sat) => {
        return {
          id: sat.noradID,
          names: sat.names.map((name) => name.names).join(", "),
        };
      });
    return [rows, !sub.ready()];
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
    <React.Fragment>
      <Container className={classes.satelliteContainer} maxWidth="md">
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
          Each <strong>satellite</strong> in the catalogue contains a number of
          fields based on schemas defined on the{" "}
          <Tooltip title="Bring me to the satellites page">
            <Link exact to="/schemas" className={classes.link}>
              next page
            </Link>
          </Tooltip>
          . Click on the <strong>satellite</strong> names in the table to bring
          up the schemas and data associated with the <strong>satellite</strong>
          .
        </Typography>
        <DataGrid
          style={{ height: "75vh", width: "100%" }}
          columns={columns}
          rows={rows}
          pageSize={10}
          rowsPerPageOptions={[10]}
          // checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
          onClick={() => handleRowClick(satellite)}
        />

        {/* <TableContainer component={Paper}>
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
        </TableContainer> */}
      </Container>

      <SatelliteModal
        show={showModal}
        newSat={newSat}
        initValues={initialSatValues}
        handleClose={() => setShowModal(false)}
      />
    </React.Fragment>

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
