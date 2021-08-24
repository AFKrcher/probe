import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

// Components
import { SatelliteModal } from "./SatelliteModal/SatelliteModal";
import { SatelliteCollection } from "../api/satellites";
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
      editable: false,
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [newSat, setNewSat] = useState(true);
  const [initialSatValues, setInitialSatValues] = useState(newSatValues);
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

  const [page, setPage] = useState(0);
  const [limiter, setLimiter] = useState(5);
  const [sortNorad, setSortNorad] = useState(0);
  const [sortNames, setSortNames] = useState(0);
  const [selector, setSelector] = useState({});
  const [rows, schemas, count, schemasIsLoading, loading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const count = SatelliteCollection.find().count();
    const schemas = SatelliteCollection.find(selector, {
      limit: limiter,
      skip: page * limiter,
      sort: sortNames ? { names: sortNames } : { noradID: sortNorad },
    }).fetch();
    const rows = schemas.map((sat) => {
      return {
        id: sat.noradID,
        names: sat.names.map((name) => name.names || name.name).join(", "),
      };
    });
    rows.getRows = count;
    return [rows, schemas, count, !sub.ready(), !sub.ready()];
  });

  const handleFilter = (e) => {
    const filterBy = e.items[0];
    if (filterBy && filterBy.value) {
      if (filterBy.columnField === "id") {
        setSelector({
          noradID: { $regex: `/${filterBy.value}/` },
        });
      } else {
        setSelector({
          "names.name": { $regex: `${filterBy.value}*`, $options: "i" },
        });
      }
    } else {
      setSelector({});
    }
  };

  return (
    <div style={{ paddingBottom: 40 }}>
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

        <DataGrid
          components={{
            Toolbar: GridToolbar,
          }}
          columns={columns}
          rows={rows}
          rowCount={count}
          pageSize={limiter}
          loading={loading}
          style={{ height: "60vh", width: "100%" }}
          pagination
          paginationMode="server"
          filterMode="server"
          onFilterModelChange={(e) => {
            handleFilter(e);
          }}
          rowsPerPageOptions={[1, 2, 5, 10, 15, 20]}
          onPageSizeChange={(newLimit) => setLimiter(newLimit)}
          onPageChange={(newPage) => setPage(newPage)}
          disableSelectionOnClick
          onRowClick={(satellite) => {
            handleRowClick(
              SatelliteCollection.find({ noradID: satellite.id }).fetch()[0]
            );
          }}
          onSortModelChange={(e) => {
            if (e[0]) {
              if (e[0].field === "id") {
                e[0].sort === "asc" ? setSortNorad(1) : setSortNorad(-1);
              } else {
                e[0].sort === "asc" ? setSortNames(-1) : setSortNames(1);
              }
            } else {
              setSortNorad(0);
              setSortNames(0);
            }
          }}
        />
      </Container>
      <SatelliteModal
        show={showModal}
        newSat={newSat}
        initValues={initialSatValues}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};
