import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

// Components
import { SatelliteModal } from "./SatelliteModal/SatelliteModal";
import { SatelliteCollection } from "../api/satellite";
import { getSatID, getSatName } from "./util/satelliteDataFuncs";
import { SatelliteSchemaAccordion } from "./SatelliteModal/SatelliteSchemaAccordion";

// ag-grid
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

// @material-ui
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
    "&:hover": {
      color: theme.palette.info.light,
    },
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
    const sats = SatelliteCollection.find({}, { limit: 4 }).fetch();
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

  // AG Grid stuff
  const [gridApi, setGridApi] = useState(null);
  const [skip, setSkip] = useState(0);
  // const [currentData, setCurrentData] = useState([]);
  // const [length, setLength] = useState([]);
  const perPage = 4;

  let length = SatelliteCollection.find().count();
  let currentData = SatelliteCollection.find(
    {},
    { skip: skip, limit: perPage }
  ).fetch();

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      const dataSource = {
        getRows: (params) => {
          params.startRow = 1;
          params.endRow = perPage;

          params.successCallback(currentData, length);
        },
      };
      gridApi.setDatasource(dataSource);
    }
  }, [gridApi]);

  return (
    <React.Fragment>
      <Container className={classes.satelliteContainer} maxWidth="md">
        <DataGrid
          style={{ height: "50vh", width: "100%" }}
          columns={columns}
          rows={rows}
          pageSize={4}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
          onClick={() => {
            console.log("sat", satellite);
            handleRowClick(satellite);
          }}
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
                    // key={`sat-row-${i}`}
                    className={classes.tableRow}
                    onClick={(e) => {
                      console.log("e", e);
                      setInitialSatValues(
                        SatelliteCollection.find({
                          noradID: satellite.id,
                        }).fetch()[0]
                      );
                      handleRowClick(satellite);
                    }}
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

        <div
          className="ag-theme-alpine-dark ag-theme-astro dark-theme"
          // style={{ height: "60vh" }}
        >
          <AgGridReact
            // rowData={rows}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              flex: 1,
            }}
            domLayout="autoHeight"
            rowModelType="infinite"
            cacheBlockSize={perPage}
            animateRows={true}
            pagination={true}
            paginationPageSize={perPage}
            cacheBlockSize={perPage}
            onGridReady={onGridReady}
            onRowClicked={(e) => {
              setInitialSatValues(
                SatelliteCollection.find({ noradID: e.data.id }).fetch()[0]
              );
              handleRowClick(
                SatelliteCollection.find({ noradID: e.data.id }).fetch()
              );
            }}
          >
            <AgGridColumn field="noradID" headerName="NORAD ID" />
            <AgGridColumn field="names" headerName="NAME(S)" />
          </AgGridReact>
        </div>
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
              + Add Satellite
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
            <Link to="/schemas" className={classes.link}>
              next page
            </Link>
          </Tooltip>
          . Click on the <strong>satellite</strong> names in the table to bring
          up the schemas and data associated with the <strong>satellite</strong>
          .
        </Typography>
      </Container>

      <SatelliteModal
        show={showModal}
        newSat={newSat}
        initValues={initialSatValues}
        handleClose={() => setShowModal(false)}
      />
    </React.Fragment>
  );
};
