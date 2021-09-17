import React, { useState, useEffect } from "react";
// Imports
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

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
  IconButton,
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";
import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  description: {
    marginBottom: 25,
    marginTop: 10,
  },
  gridContainer: {
    marginBottom: 5,
    marginLeft: -10,
  },
  dataGrid: {
    backgroundColor: theme.palette.grid.background,
    overflowY: "auto",
    resize: "horizontal",
    "& .MuiDataGrid-cell": {
      textOverflow: "clip",
    },
    "& .MuiCircularProgress-colorPrimary": {
      color: theme.palette.text.primary,
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
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: "14px",
  },
  gridCaption: {
    marginLeft: 5,
    color: theme.palette.text.disabled,
  },
}));

const newSatValues = {
  noradID: "",
};

export const SatellitesTable = ({ roles }) => {
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);
  const [newSat, setNewSat] = useState(true);
  const [initialSatValues, setInitialSatValues] = useState(newSatValues);
  const [page, setPage] = useState(0);
  const [limiter, setLimiter] = useState(10);
  const [sortNorad, setSortNorad] = useState(0);
  const [sortNames, setSortNames] = useState(0);
  const [sortType, setSortType] = useState(0);
  const [sortOrbit, setSortOrbit] = useState(0);
  const [selector, setSelector] = useState({});
  const [columns, setColumns] = useState([]);
  const [newFavorite, setNewFavorite] = useState(false);

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

  const handleFavorite = (e, values) => {
    e.preventDefault();
    Meteor.call("addToFavorites", Meteor.userId(), values, (err, res) => {
      return [err, res];
    });
    setNewFavorite(!newFavorite);
  };

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

  const handleFilter = (e) => {
    const filterBy = e.items[0];
    if (filterBy && filterBy.value) {
      switch (filterBy.columnField) {
        case "id":
          setSelector({
            noradID: { $regex: `${filterBy.value}` },
          });
          break;
        case "names":
          setSelector({
            "names.name": { $regex: `${filterBy.value}`, $options: "i" },
          });
          break;
        case "type":
          setSelector({
            "type.type": { $regex: `${filterBy.value}`, $options: "i" },
          });
          break;
        case "orbit":
          setSelector({
            "orbit.orbit": { $regex: `${filterBy.value}`, $options: "i" },
          });
          break;
        default:
          setSelector({});
      }
    } else {
      alert(
        `There was a problem with the filter. Please see the following context: ${e}`
      );
    }
  };

  const handleSort = (e) => {
    if (e[0]) {
      switch (e[0].field) {
        case "id":
          e[0].sort === "asc" ? setSortNorad(1) : setSortNorad(-1);
          break;
        case "names":
          e[0].sort === "asc" ? setSortNames(-1) : setSortNames(1);
          break;
        case "type":
          e[0].sort === "asc" ? setSortType(-1) : setSortType(1);
          break;
        case "orbit":
          e[0].sort === "asc" ? setSortOrbit(-1) : setSortOrbit(1);
          break;
        default:
          alert(
            `There was a problem with the filter. Please see the following context: ${e}`
          );
      }
    } else {
      setSortNorad(0);
      setSortNames(0);
      setSortType(0);
      setSortOrbit(0);
    }
  };

  const permissionToAddSatellite = () => {
    return Meteor.userId() ? (
      <Grid container item xs justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewSatellite}
        >
          + Add Satellite
        </Button>
      </Grid>
    ) : null;
  };

  const favoritesNameShortener = (params) => {
    const names = params.row.names;
    if (names) {
      let index = names.indexOf(",");
      return index === -1 ? names : names.substr(0, index);
    } else {
      return params.id;
    }
  };

  useEffect(() => {
    const columns = [
      {
        headerAlign: "left",
        field: "id",
        headerName: "NORAD ID",
        minWidth: 170,
      },
      {
        headerAlign: "left",
        field: "type",
        headerName: "TYPE",
        minWidth: 150,
        editable: false,
      },
      {
        headerAlign: "left",
        field: "orbit",
        headerName: "ORBIT(S)",
        minWidth: 200,
        editable: false,
      },
      {
        headerAlign: "left",
        field: "names",
        headerName: "NAME(S)",
        minWidth: 250,
        flex: 1,
        editable: false,
      },
    ];

    if (Meteor.userId()) {
      columns.unshift({
        field: <Star style={{ marginBottom: -5 }} />,
        minWidth: 50,
        headerAlign: "center",
        renderCell: function favoritesRow(params) {
          return (
            <Tooltip
              title={`Add ${favoritesNameShortener(params)} to favorites`}
              arrow
              placement="bottom-start"
            >
              <IconButton
                style={{ marginLeft: 3 }}
                size="small"
                onClick={(e) => {
                  handleFavorite(e, params.id);
                }}
              >
                {Meteor.user()?.favorites?.indexOf(params.id) > -1 ? (
                  <Star />
                ) : (
                  <StarBorder />
                )}
              </IconButton>
            </Tooltip>
          );
        },
      });
    }

    setColumns(columns);
  }, [Meteor.userId(), newFavorite]);

  const [rows, count, isLoadingSchemas, isLoadingSats] = useTracker(() => {
    const subSchemas = Meteor.subscribe("satellites");
    const subSats = Meteor.subscribe("satellites");
    const count = SatelliteCollection.find().count();
    const sats = SatelliteCollection.find(selector, {
      limit: limiter,
      skip: page * limiter,
      sort: sortNames
        ? { names: sortNames }
        : sortNorad
        ? { noradID: sortNorad }
        : sortType
        ? { type: sortType }
        : { orbit: sortOrbit },
    }).fetch();
    const rows = sats.map((sat) => {
      return {
        id: sat.noradID,
        names: sat.names?.map((name) => name.names || name.name).join(", "),
        type: sat.type ? sat.type[0].type : "N/A",
        orbit: sat.orbit
          ? sat.orbit.map((entry) => entry.orbit).join(", ")
          : "N/A",
      };
    });
    rows.getRows = count;
    return [rows, count, !subSchemas.ready(), !subSats.ready()];
  });

  return (
    <div className={classes.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Typography variant="h3">Satellites</Typography>
        </Grid>
        {permissionToAddSatellite()}
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
      <div className={classes.gridContainer}>
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
          loading={isLoadingSats && isLoadingSchemas}
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
          onRowDoubleClick={(satellite) => {
            handleRowClick(
              SatelliteCollection.find({ noradID: satellite.id }).fetch()[0]
            );
          }}
          onSortModelChange={handleSort}
        />
      </div>
      <Typography variant="caption" className={classes.gridCaption}>
        Click to interact with a cell, Double-click to view satellite data
      </Typography>
      <SatelliteModal
        roles={roles}
        show={showModal}
        newSat={newSat}
        initValues={initialSatValues}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};
