import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

// Components
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import { SatelliteCollection } from "../../api/satellites";

// @material-ui
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Tooltip,
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  description: {
    marginBottom: 25,
    marginTop: 10,
  },
  dataGrid: {
    backgroundColor: theme.palette.grid.background,
    overflowY: "auto",
    resize: "horizontal",
    "& .MuiDataGrid-cell": {
      textOverflow: "clip",
    },
    "& .MuiCircularProgress-colorPrimary": {
      color: theme.palette.text.primary
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
  toolbarContainer: {
    margin: 5,
  },
  toolbar: {
    color: theme.palette.grid.text,
    fontWeight: 500,
    fontSize: "14px",
  },
}));

const newSatValues = {
  noradID: "",
};

export const SatellitesTable = () => {
  const classes = useStyles();

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <GridToolbarColumnsButton className={classes.toolbar} />
        <GridToolbarFilterButton className={classes.toolbar} />
        <GridToolbarDensitySelector className={classes.toolbar} />
        <GridToolbarExport className={classes.toolbar} />
      </GridToolbarContainer>
    );
  }

  const columns = [
    {
      headerAlign: "center",
      field: "id",
      headerName: "NORAD ID",
      minWidth: 150,
    },
    {
      headerAlign: "center",
      field: "names",
      headerName: "NAME(S)",
      minWidth: 300,
      editable: false,
    },
    {
      headerAlign: "center",
      field: "descriptions",
      headerName: "DESCRIPTION",
      minWidth: 300,
      editable: false,
      flex: 1,
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
  const [limiter, setLimiter] = useState(10);
  const [sortNorad, setSortNorad] = useState(0);
  const [sortNames, setSortNames] = useState(0);
  const [selector, setSelector] = useState({});

  const [rows, sats, count, schemasIsLoading, loading] = useTracker(() => {
    const sub = Meteor.subscribe("satellites");
    const count = SatelliteCollection.find().count();
    const sats = SatelliteCollection.find(selector, {
      limit: limiter,
      skip: page * limiter,
      sort: sortNames ? { names: sortNames } : { noradID: sortNorad },
    }).fetch();
    const rows = sats.map((sat) => {
      return {
        id: sat.noradID,
        names: sat.names?.map((name) => name.names || name.name).join(", "),
        descriptions: sat.descriptionShort
        ? sat.descriptionShort[0].descriptionShort
        : "N/A",
      };
    });
    rows.getRows = count;
    return [rows, sats, count, !sub.ready(), !sub.ready()];
  });

  const handleFilter = (e) => {
    const filterBy = e.items[0];
    if (filterBy && filterBy.value) {
      if (filterBy.columnField === "id") {
        setSelector({
          noradID: { $regex: `${filterBy.value}` },
        });
      } else {
        setSelector({
          "names.name": { $regex: `${filterBy.value}`, $options: "i" },
        });
      }
    } else {
      setSelector({});
    }
  };

  return (
    <div className={classes.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Typography variant="h3">Satellites</Typography>
        </Grid>
        <Grid container item xs justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewSatellite}
          >
            + Add Satellite
          </Button>
        </Grid>
      </Grid>
      <Typography gutterBottom variant="body2" className={classes.description}>
        Each <strong>satellite</strong> in the catalogue contains a number of
        fields based on schemas defined on the{" "}
        <Tooltip title="Bring me to the satellites page">
          <Link to="/schemas" className={classes.link}>
            next page
          </Link>
        </Tooltip>
        . Click on the <strong>satellite</strong> names in the table to bring up
        the schemas and data associated with the <strong>satellite</strong>.
      </Typography>
      <DataGrid
        className={classes.dataGrid}
        components={{
          Toolbar: CustomToolbar,
        }}
        rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
        columns={columns}
        rows={rows}
        rowCount={count}
        pageSize={limiter}
        loading={loading}
        autoHeight={true}
        pagination
        paginationMode="server"
        filterMode="server"
        onFilterModelChange={(e) => {
          handleFilter(e);
        }}
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
      <SatelliteModal
        show={showModal}
        newSat={newSat}
        initValues={initialSatValues}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};
