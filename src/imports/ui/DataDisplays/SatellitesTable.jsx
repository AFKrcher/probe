import React, { useState, useEffect, useContext } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { Link, useHistory } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import useWindowSize from "../hooks/useWindowSize.jsx";
import ProtectedFunctionality from "../Helpers/ProtectedFunctionality.jsx";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";
import { downloadFile, jsonDownload } from "../utils/commonDataFuncs";
import { exportTableToCSV } from "../utils/satelliteDataFuncs";

// Components
import { SearchBar } from "../Helpers/SearchBar.jsx";
import VisualizeDialog from "../Dialogs/VisualizeDialog";
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import { SatelliteCollection } from "/imports/api/satellites";
import { SchemaCollection } from "/imports/api/schemas";
import SnackBar from "../Dialogs/SnackBar.jsx";
import { Popper } from "../Dialogs/Popper.jsx";
import { Key } from "../Helpers/Key.jsx";

// @material-ui
import { Button, Grid, makeStyles, Typography, Tooltip, IconButton } from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  getGridStringOperators,
  GridToolbarDensitySelector
} from "@material-ui/data-grid";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StorageIcon from "@material-ui/icons/Storage";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Download from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%"
  },
  description: {
    marginTop: 15,
    marginBottom: 20
  },
  dataGrid: {
    padding: "5px 5px 0px 5px",
    backgroundColor: theme.palette.grid.background,
    marginTop: 5,
    "& .MuiDataGrid-cell": {
      textOverflow: "ellipse"
    },
    "& .MuiCircularProgress-colorPrimary": {
      color: theme.palette.text.primary
    }
  },
  spinner: {
    color: theme.palette.text.primary
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.info.main
    }
  },
  toolbarSpacer: {
    marginBottom: 75
  },
  toolbarContainer: {
    margin: 5
  },
  toolbar: {
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: "14px"
  },
  downloadBar: {
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: "14px"
  },
  downloadIcon: {
    marginRight: 3,
    marginLeft: -5
  },
  searchBarContainer: {
    position: "relative",
    marginTop: -70,
    bottom: -135,
    zIndex: 1,
    margin: 20
  },
  actions: {
    display: "flex",
    marginLeft: 0
  },
  actionIconButton: {
    padding: 7,
    marginLeft: 15
  },
  starIconButton: {
    marginLeft: 15
  },
  starButtonFilled: {
    cursor: "pointer",
    fill: "#ffc708"
  },
  starButtonHeader: {
    cursor: "pointer",
    fill: "#ffc708",
    marginBottom: -6
  },
  modalButton: {
    marginTop: -2.5
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    margin: "0px 5px -15px 5px"
  }
}));

const newSatValues = {
  noradID: "",
  isDeleted: null,
  createdOn: null,
  createdBy: null,
  modifiedOn: null,
  modifiedBy: null,
  adminCheck: null,
  machineCheck: null
};

// breakpoints based on device width / height
const addButtonBreak = 650;

export const SatellitesTable = () => {
  const classes = useStyles();

  const history = useHistory();
  const { setOpenSnack, snack, setSnack, setOpenVisualize } = useContext(HelpersContext);

  const [width, height] = useWindowSize();

  const [popperBody, setPopperBody] = useState(null);
  const [showPopper, setShowPopper] = useState(false);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newSat, setNewSat] = useState(true);
  const [initialSatValues, setInitialSatValues] = useState(newSatValues);
  const [page, setPage] = useState(0);
  const [sortNorad, setSortNorad] = useState(0);
  const [sortName, setSortName] = useState(0);
  const [sortType, setSortType] = useState(0);
  const [sortOrbit, setSortOrbit] = useState(0);
  const [limiter, setLimiter] = useState(20);
  const [selector, setSelector] = useState({ isDeleted: false });
  const [columns, setColumns] = useState([]);
  const [prompt, setPrompt] = useState();

  const debounced = useDebouncedCallback((row) => {
    if (row?.row?.description) {
      setPopperBody(row?.row?.description);
      setShowPopper(true);
    } else {
      setShowPopper(false);
    }
  }, 300);

  const decideSort = () => {
    if (sortName) return { names: sortName };
    if (sortNorad) return { noradID: sortNorad };
    if (sortType) return { type: sortType };
    if (sortOrbit) return { orbits: sortOrbit };
  };

  const [sats, schemas, rows, count, verified, isLoadingSchemas, isLoadingSats] = useTracker(() => {
    const subSchemas = Meteor.subscribe("schemas");
    const subSats = Meteor.subscribe("satellites");
    const verified = Meteor.user()?.emails[0] ? Meteor.user()?.emails[0]?.verified : false;
    const schemas = SchemaCollection.find({}, { fields: { name: 1 } }).fetch();
    const count = SatelliteCollection.find(selector).count();
    const sats = SatelliteCollection.find(selector, {
      limit: limiter,
      skip: page * limiter,
      sort: decideSort()
    }).fetch();
    const rows = sats.map((sat) => {
      return {
        id: sat.noradID,
        names: sat.names?.map((name) => name.names || name.name).join(", "),
        types: sat.types
          ? sat.types
              .map((type) => type.type)
              .sort((a, b) => a.localeCompare(b))
              .join(", ")
          : "",
        orbits: sat.orbits ? sat.orbits.map((entry) => entry.orbit).join(", ") : "",
        description: sat.descriptionShort ? sat.descriptionShort[0]?.descriptionShort : null
      };
    });
    rows.getRows = count;
    return [sats, schemas, rows, count, verified, !subSchemas.ready(), !subSats.ready()];
  });

  const handleAddNewSatellite = () => {
    setInitialSatValues(newSatValues);
    setNewSat(true);
    setShowModal(true);
    debounced(false);
  };

  const handleRowDoubleClick = (sat) => {
    setInitialSatValues(sat);
    setNewSat(false);
    setShowModal(true);
    debounced(false);
  };

  const handleFilter = (e) => {
    const filterBy = e.items[0];
    if (filterBy && filterBy.value) {
      switch (filterBy.columnField) {
        case "id":
          setSelector({
            noradID: { $regex: `${filterBy.value}` },
            isDeleted: false
          });
          break;
        case "names":
          setSelector({
            "names.name": { $regex: `${filterBy.value}`, $options: "i" },
            isDeleted: false
          });
          break;
        case "[object Object]":
          setSelector({
            noradID: {
              $in: Meteor.user({ fields: { favorites: 1 } })?.favorites
            },
            isDeleted: false
          });
          break;
        case "types":
          setSelector({
            "types.type": { $regex: `${filterBy.value}`, $options: "i" },
            isDeleted: false
          });
          break;
        case "orbits":
          setSelector({
            "orbits.orbit": { $regex: `${filterBy.value}`, $options: "i" }
          });
          break;
        default:
          setSelector({ isDeleted: false });
      }
    } else {
      setSelector({ isDeleted: false });
    }
    selector["isDeleted"] = false;
  };

  const handleSort = (e) => {
    if (e[0]) {
      switch (e[0].field) {
        case "id":
          e[0].sort === "asc" ? setSortNorad(1) : setSortNorad(-1);
          break;
        case "names":
          e[0].sort === "asc" ? setSortName(-1) : setSortName(1);
          break;
        case "types":
          e[0].sort === "asc" ? setSortType(-1) : setSortType(1);
          break;
        case "orbits":
          e[0].sort === "asc" ? setSortOrbit(-1) : setSortOrbit(1);
          break;
        default:
          break;
      }
    } else {
      setSortNorad(0);
      setSortName(0);
      setSortType(0);
      setSortOrbit(0);
    }
  };

  const handleVisualize = (satellite, url) => {
    setPrompt({
      url: url,
      satellite: satellite
    });
    debounced(false);
    setOpenVisualize(true);
  };

  function handleDashboard(e, id) {
    e.preventDefault();
    history.push(`/dashboard/${id}`);
    debounced(false);
  }

  const handleFavorite = (e, values, name, notFavorite) => {
    e.preventDefault();
    Meteor.call("addToFavorites", Meteor.userId(), values);

    setOpenSnack(false);
    setSnack(
      <span>
        <b>{name}</b> {!notFavorite ? "added to favorites" : "removed from favorites"}
      </span>
    );
    setTimeout(() => setOpenSnack(true), 500);
  };

  const renderFavoriteButton = (params) => {
    const favoritesNameShortener = () => {
      const names = params.row.names;
      if (names) {
        let index = names.indexOf(",");
        return index === -1 ? names : names.substr(0, index);
      } else {
        return params.id;
      }
    };

    const checkIfFavorite = () => {
      return Meteor.user({ fields: { favorites: 1 } })?.favorites?.indexOf(params.id) > -1;
    };

    return (
      <Tooltip
        title={`${
          Meteor.user({ fields: { favorites: 1 } })?.favorites?.indexOf(params.id) > -1
            ? `Remove ${favoritesNameShortener()} from favorites`
            : `Add ${favoritesNameShortener()} to favorites`
        }`}
        arrow
        placement="top">
        <IconButton
          size="small"
          className={classes.starIconButton}
          onClick={(e) => handleFavorite(e, params.id, favoritesNameShortener(), checkIfFavorite())}>
          {checkIfFavorite() ? (
            <StarIcon className={classes.starButtonFilled} />
          ) : (
            <StarBorderIcon className={classes.starButtonEmpty} />
          )}
        </IconButton>
      </Tooltip>
    );
  };

  const filterFavorites = () => {
    if (selector?.noradID) {
      return setSelector({});
    } else {
      return setSelector({
        noradID: { $in: Meteor.user({ fields: { favorites: 1 } })?.favorites },
        isDeleted: false
      });
    }
  };

  // Renders Datagrid after each change in the dependency array
  useEffect(() => {
    const columns = [
      {
        headerAlign: "center",
        filterable: false,
        sortable: false,
        field: "actions",
        headerName: "ACTIONS",
        disableExport: true,
        width: 200,
        align: "left",
        renderCell: function renderCellButtons(satellite) {
          return (
            <span className={classes.actions}>
              <Tooltip title="Satellite Data View" arrow placement="top">
                <IconButton
                  className={classes.actionIconButton}
                  onClick={() =>
                    handleRowDoubleClick(
                      SatelliteCollection.find({
                        noradID: satellite.id
                      }).fetch()[0]
                    )
                  }>
                  <StorageIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Satellite Dashboard View" arrow placement="top">
                <IconButton
                  className={classes.actionIconButton}
                  onClick={(e) => {
                    handleDashboard(e, satellite.id);
                  }}>
                  <DashboardIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Visualize satellite in Space Cockpit" arrow placement="top">
                <IconButton
                  className={classes.actionIconButton}
                  onClick={() => {
                    handleVisualize(
                      satellite?.row?.names,
                      `https://spacecockpit.saberastro.com/?SID=${satellite.id}&FS=${satellite.id}`
                    );
                  }}>
                  <img src="/assets/saberastro.png" width="22px" height="22px" />
                </IconButton>
              </Tooltip>
            </span>
          );
        }
      },
      {
        headerAlign: "left",
        field: "id",
        headerName: "NORAD ID",
        width: 150,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === "contains")
      },
      {
        headerAlign: "left",
        field: "orbits",
        headerName: "ORBIT(S)",
        width: 140,
        editable: false,
        filterable: false
      },
      {
        headerAlign: "left",
        field: "types",
        headerName: "TYPE(S)",
        width: 200,
        editable: false,
        filterable: false,
        hide: true
      },
      {
        headerAlign: "left",
        field: "names",
        headerName: "NAME(S)",
        width: 250,
        flex: 1,
        editable: false,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === "contains")
      }
    ];

    if (Meteor.userId() && verified) {
      columns.unshift({
        field: (
          <Tooltip title="Toggle favorites filter" arrow placement="top">
            <span onClick={() => filterFavorites()}>
              <StarIcon className={classes.starButtonHeader} />
            </span>
          </Tooltip>
        ),
        filterable: false,
        sortable: false,
        width: 50,
        headerAlign: "center",
        renderCell: function favoritesRow(params) {
          return renderFavoriteButton(params);
        }
      });
    }

    setColumns(columns);
  }, [Meteor.userId(), verified, selector]);

  const CustomToolbar = () => {
    return (
      <div className={classes.toolbarSpacer}>
        <GridToolbarContainer className={classes.toolbarContainer}>
          <GridToolbarColumnsButton className={classes.toolbar} />
          <GridToolbarFilterButton className={classes.toolbar} />
          <GridToolbarDensitySelector className={classes.toolbar} />
          <Button size="small" onClick={() => jsonDownload(sats)} className={classes.downloadBar} color="primary">
            <Download fontSize="small" className={classes.downloadIcon} />
            {width > addButtonBreak ? "Export JSON" : "JSON"}
          </Button>
          <Button
            color="primary"
            className={classes.downloadBar}
            size="small"
            onClick={() => exportTableToCSV(schemas, sats, downloadFile)}
            // temporarily disabling CSV output until customer need and utility are re-evaluated
            style={{ display: "none" }}>
            <Download fontSize="small" className={classes.downloadIcon} />
            {width > addButtonBreak ? "Export CSV" : "CSV"}
          </Button>
        </GridToolbarContainer>
      </div>
    );
  };

  const AddSatelliteButton = () => {
    return (
      <Grid container item xs justifyContent={width > addButtonBreak ? "flex-end" : "flex-start"}>
        <Button variant="contained" color="primary" onClick={handleAddNewSatellite}>
          + Add Satellite
        </Button>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <VisualizeDialog body={prompt} />
      <SnackBar bodySnackBar={snack} />
      <div className={classes.root}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs>
            <Typography variant="h3">Satellites</Typography>
          </Grid>
          {width > addButtonBreak && <ProtectedFunctionality component={AddSatelliteButton} loginRequired={true} />}
        </Grid>
        {width < addButtonBreak ? (
          <div style={{ margin: "10px 0px 20px 0px" }}>
            <ProtectedFunctionality component={AddSatelliteButton} loginRequired={true} />
          </div>
        ) : null}
        <Typography gutterBottom variant="body1" className={classes.description}>
          Each <b>satellite</b> in the catalogue contains a number of fields based on schemas defined on the{" "}
          <Tooltip placement="top" arrow title="Bring me to the satellites page">
            <Link to="/schemas" className={classes.link}>
              schemas page
            </Link>
          </Tooltip>
          . Filtering on satellites using tags in the search bar will allow you to view the results in the table and
          export the results to a CSV or JSON format.
        </Typography>
        <Key page="SatellitesTable" />
        <div className={classes.searchBarContainer}>
          <SearchBar filter={filter} setFilter={setFilter} selector={selector} setSelector={setSelector} />
        </div>
        <DataGrid
          className={classes.dataGrid}
          components={{
            Toolbar: CustomToolbar
          }}
          rowsPerPageOptions={[20, 40, 60, 120]}
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
            handleRowDoubleClick(SatelliteCollection.find({ noradID: satellite.id }).fetch()[0]);
          }}
          onSortModelChange={handleSort}
          onRowOver={debounced}
          onRowOut={() => {
            debounced(false);
            setShowPopper(false);
          }}
        />
        <Popper open={showPopper} value={popperBody} />
        <SatelliteModal
          show={showModal}
          newSat={newSat}
          initValues={initialSatValues}
          handleClose={() => {
            setShowModal(false);
            setTimeout(() => setInitialSatValues(newSatValues), 500);
          }}
          width={width}
          height={height}
        />
      </div>
    </React.Fragment>
  );
};
