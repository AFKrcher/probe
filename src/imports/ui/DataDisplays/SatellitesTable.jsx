import React, { useState, useEffect, useContext } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { Link, useHistory } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import useWindowSize from "../Hooks/useWindowSize.jsx";
import ProtectedFunctionality from "../utils/ProtectedFunctionality.jsx";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

// Components
import { SearchBar } from "../Helpers/SearchBar.jsx";
import VisualizeDialog from "../Dialogs/VisualizeDialog";
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import { SatelliteCollection } from "../../api/satellites";
import SnackBar from "../Dialogs/SnackBar.jsx";
import { Popper } from "../Dialogs/Popper.jsx";
import { Key } from "../Helpers/Key.jsx";

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
  getGridStringOperators,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DashboardIcon from "@material-ui/icons/Dashboard";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  description: {
    marginBottom: 20,
    marginTop: 10,
  },
  gridContainer: {
    display: "flex",
    height: "100%",
    width: "100%",
    marginTop: 5,
    resize: "horizontal",
  },
  dataGrid: {
    padding: "5px 5px 0px 5px",
    backgroundColor: theme.palette.grid.background,
    "& .MuiDataGrid-cell": {
      textOverflow: "ellipse",
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
    color: theme.palette.text.disabled,
  },
  actions: {
    display: "flex",
    marginLeft: 0,
  },
  actionIconButton: {
    padding: 7,
    marginLeft: 15,
  },
  starIconButton: {
    marginLeft: 15,
  },
  starButtonFilled: {
    cursor: "pointer",
    fill: "gold",
    "&:hover": {
      color: theme.palette.info.light,
    },
  },
  starButtonHeader: {
    cursor: "pointer",
    fill: "gold",
    marginBottom: -5,
  },
  modalButton: {
    marginTop: -2.5,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    margin: "0px 5px -15px 5px",
  },
}));

const newSatValues = {
  noradID: "",
};

// breakpoints based on device width / height
const addButtonBreak = 650;

export const SatellitesTable = () => {
  const classes = useStyles();

  const history = useHistory();

  const { setOpenSnack, snack, setSnack, setOpenVisualize } =
    useContext(HelpersContext);

  const [width, height] = useWindowSize();

  const [popperBody, setPopperBody] = useState(null);
  const [showPopper, setShowPopper] = useState(false);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newSat, setNewSat] = useState(true);
  const [initialSatValues, setInitialSatValues] = useState(newSatValues);
  const [page, setPage] = useState(0);
  const [limiter, setLimiter] = useState(10);
  const [sortNorad, setSortNorad] = useState(0);
  const [sortName, setSortName] = useState(0);
  const [sortType, setSortType] = useState(0);
  const [sortOrbit, setSortOrbit] = useState(0);
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

  const [rows, isLoadingSchemas, isLoadingSats, count] = useTracker(() => {
    const subSchemas = Meteor.subscribe("satellites");
    const subSats = Meteor.subscribe("satellites");
    const count = SatelliteCollection.find(selector).count();
    const sats = SatelliteCollection.find(selector, {
      limit: limiter,
      skip: page * limiter,
      sort: decideSort(),
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
        orbits: sat.orbits
          ? sat.orbits.map((entry) => entry.orbit).join(", ")
          : "",
        description: sat.descriptionShort
          ? sat.descriptionShort[0]?.descriptionShort
          : null,
      };
    });
    rows.getRows = count;
    return [rows, !subSchemas.ready(), !subSats.ready(), count];
  });

  function CustomToolbar() {
    return (
      <GridToolbarContainer className={classes.toolbarContainer}>
        <GridToolbarColumnsButton className={classes.toolbar} />
        <GridToolbarFilterButton className={classes.toolbar} />
        <GridToolbarDensitySelector className={classes.toolbar} />
      </GridToolbarContainer>
    );
  }

  const handleAddNewSatellite = () => {
    setInitialSatValues(newSatValues);
    setNewSat(true);
    setShowModal(true);
    debounced(false);
  };

  const handleRowDoubleClick = (schemaObject) => {
    setInitialSatValues(schemaObject);
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
            isDeleted: false,
          });
          break;
        case "names":
          setSelector({
            "names.name": { $regex: `${filterBy.value}`, $options: "i" },
            isDeleted: false,
          });
          break;
        case "[object Object]":
          setSelector({
            noradID: { $in: Meteor.user().favorites },
            isDeleted: false,
          });
          break;
        case "types":
          setSelector({
            "types.type": { $regex: `${filterBy.value}`, $options: "i" },
            isDeleted: false,
          });
          break;
        case "orbits":
          setSelector({
            "orbits.orbit": { $regex: `${filterBy.value}`, $options: "i" },
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

  const handleFavorite = (e, values, name, notFavorite) => {
    e.preventDefault();
    Meteor.call("addToFavorites", Meteor.userId(), values, (err, res) => {
      return res;
    });

    setOpenSnack(false);
    setSnack(
      <span>
        <strong>{name}</strong>{" "}
        {!notFavorite ? "added to favorites" : "removed from favorites"}
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
      return Meteor.user()?.favorites?.indexOf(params.id) > -1;
    };

    return (
      <Tooltip
        title={`${
          Meteor.user()?.favorites?.indexOf(params.id) > -1
            ? `Remove ${favoritesNameShortener()} from favorites`
            : `Add ${favoritesNameShortener()} to favorites`
        }`}
        arrow
        placement="top"
      >
        <IconButton
          size="small"
          className={classes.starIconButton}
          onClick={(e) =>
            handleFavorite(
              e,
              params.id,
              favoritesNameShortener(),
              checkIfFavorite()
            )
          }
        >
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
        noradID: { $in: Meteor.user().favorites },
        isDeleted: false,
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
                        noradID: satellite.id,
                      }).fetch()[0]
                    )
                  }
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Satellite Dashboard View" arrow placement="top">
                <IconButton
                  className={classes.actionIconButton}
                  onClick={(e) => {
                    handleDashboard(e, satellite.id);
                  }}
                >
                  <DashboardIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Visualize satellite in Space Cockpit"
                arrow
                placement="top"
              >
                <IconButton
                  className={classes.actionIconButton}
                  onClick={() => {
                    handleVisualize(
                      satellite.row.names,
                      `https://spacecockpit.saberastro.com/?SID=${satellite.id}&FS=${satellite.id}`
                    );
                  }}
                >
                  <img
                    src="/assets/saberastro.png"
                    width="24px"
                    height="24px"
                  />
                </IconButton>
              </Tooltip>
            </span>
          );
        },
      },
      {
        headerAlign: "left",
        field: "id",
        headerName: "NORAD ID",
        minWidth: 150,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === "contains"
        ),
      },
      {
        headerAlign: "left",
        field: "orbits",
        headerName: "ORBIT(S)",
        minWidth: 140,
        editable: false,
        filterable: false,
      },
      {
        headerAlign: "left",
        field: "types",
        headerName: "TYPE(S)",
        minWidth: 200,
        editable: false,
        filterable: false,
      },
      {
        headerAlign: "left",
        field: "names",
        headerName: "NAME(S)",
        minWidth: 250,
        flex: 1,
        editable: false,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === "contains"
        ),
      },
    ];

    if (Meteor.userId()) {
      columns.unshift({
        field: (
          <Tooltip title="Toggle favorites filter" arrow placement="top-start">
            <span onClick={() => filterFavorites()}>
              <StarIcon className={classes.starButtonHeader} />
            </span>
          </Tooltip>
        ),
        filterable: false,
        sortable: false,
        minWidth: 50,
        headerAlign: "center",
        renderCell: function favoritesRow(params) {
          return renderFavoriteButton(params);
        },
      });
    }

    setColumns(columns);
  }, [Meteor.userId(), selector]);

  const handleVisualize = (satellite, url) => {
    setPrompt({
      url: url,
      satellite: satellite,
    });
    debounced(false);
    setOpenVisualize(true);
  };

  function handleDashboard(e, id) {
    e.preventDefault();
    history.push(`/dashboard/${id}`);
    debounced(false);
  }

  const AddSatelliteButton = () => {
    return (
      <Grid
        container
        item
        xs
        justifyContent={width > addButtonBreak ? "flex-end" : "flex-start"}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewSatellite}
        >
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
          {width > addButtonBreak ? (
            <ProtectedFunctionality
              component={AddSatelliteButton}
              loginRequired={true}
            />
          ) : null}
        </Grid>
        {width < addButtonBreak ? (
          <div style={{ margin: "10px 0px 20px 0px" }}>
            <ProtectedFunctionality
              component={AddSatelliteButton}
              loginRequired={true}
            />
          </div>
        ) : null}
        <Typography
          gutterBottom
          variant="body1"
          className={classes.description}
        >
          Each <strong>satellite</strong> in the catalogue contains a number of
          fields based on schemas defined on the{" "}
          <Tooltip title="Bring me to the satellites page">
            <Link to="/schemas" className={classes.link}>
              next page
            </Link>
          </Tooltip>
          . Double-click on the <strong>satellite</strong> names in the table to
          bring up the schemas and data associated with the{" "}
          <strong>satellite</strong>.
        </Typography>
        <Key page="SatellitesTable" />
        <SearchBar
          filter={filter}
          setFilter={setFilter}
          selector={selector}
          setSelector={setSelector}
        />
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
              handleRowDoubleClick(
                SatelliteCollection.find({ noradID: satellite.id }).fetch()[0]
              );
            }}
            onSortModelChange={handleSort}
            onRowOver={debounced}
            onRowOut={() => {
              debounced(false);
              setShowPopper(false);
            }}
          />
        </div>

        <Popper open={showPopper} value={popperBody} />
        <SatelliteModal
          show={showModal}
          newSat={newSat}
          initValues={initialSatValues}
          handleClose={() => {
            setShowModal(false);
            setInitialSatValues(newSatValues);
          }}
          width={width}
          height={height}
        />
      </div>
    </React.Fragment>
  );
};
