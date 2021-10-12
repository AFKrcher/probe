import React, { useState, useEffect, useContext } from "react";
// Imports
import { Link, useHistory } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import useWindowSize from "../Hooks/useWindowSize.jsx";
import ProtectedFunctionality from "../utils/ProtectedFunctionality.jsx";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

// Components
import { SearchBar } from "./SearchBar.jsx";
import VisualizeDialog from "../Dialogs/VisualizeDialog";
import { SatelliteModal } from "../SatelliteModal/SatelliteModal";
import { SatelliteCollection } from "../../api/satellites";
import SnackBar from "../Dialogs/SnackBar.jsx";
import { Popper } from "../Dialogs/Popper.jsx";

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
import MouseIcon from "@material-ui/icons/Mouse";
import VerifiedIcon from "@material-ui/icons/CheckBox";
import ValidatedIcon from "@material-ui/icons/LibraryAddCheck";
import ReportIcon from "@material-ui/icons/Report";
import ErrorIcon from "@material-ui/icons/Warning";
import ReportOutlinedIcon from "@material-ui/icons/ReportOutlined";
import ErrorOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  description: {
    marginBottom: 20,
    marginTop: 10,
  },
  key: {
    marginBottom: 25,
    display: "flex",
  },
  keyItems: {
    marginRight: "0.5ch",
  },
  keyItemsStar: {
    marginRight: "0.5ch",
    fill: "gold",
  },
  keyItemsValid: {
    marginRight: "0.5ch",
    fill: theme.palette.success.light,
  },
  keyItemsPartial: {
    marginRight: "0.5ch",
    fill: theme.palette.warning.light,
  },
  keyItemsInvalid: {
    marginRight: "0.5ch",
    fill: theme.palette.error.light,
  },
  showKey: {
    marginTop: 10,
    marginBottom: 20,
    color: theme.palette.text.disabled,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.info.light,
    },
    width: "10ch",
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
  isDeleted: false,
};

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
  const [sortNames, setSortNames] = useState(0);
  const [sortType, setSortType] = useState(0);
  const [sortOrbit, setSortOrbit] = useState(0);
  const [selector, setSelector] = useState({});
  const [columns, setColumns] = useState([]);
  const [prompt, setPrompt] = useState();
  const [showKey, setShowKey] = useState(false);

  const debounced = useDebouncedCallback((row) => {
    if (row?.row?.description) {
      setPopperBody(row?.row?.description);
      setShowPopper(true);
    } else {
      setShowPopper(false);
    }
  }, 300);

  const decideSort = () => {
    if (sortNames) return { names: sortNames };
    if (sortNorad) return { noradID: sortNorad };
    if (sortType) return { type: sortType };
    if (sortOrbit) return { orbit: sortOrbit };
  };

  const [rows, isLoadingSchemas, isLoadingSats, count] = useTracker(() => {
    const subSchemas = Meteor.subscribe("satellites");
    const subSats = Meteor.subscribe("satellites");
    const count = SatelliteCollection.find({
      $or: [
        {
          isDeleted: false,
        },
        {
          isDeleted: undefined,
        },
      ],
    }).count();
    const sats = SatelliteCollection.find(selector, {
      limit: limiter,
      skip: page * limiter,
      sort: decideSort(),
    }).fetch();
    const rows = sats
      .filter((sat) => !sat.isDeleted)
      .map((sat) => {
        return {
          id: sat.noradID,
          names: sat.names?.map((name) => name.names || name.name).join(", "),
          types: sat.types
            ? sat.types
                .map((type) => type.type)
                .sort((a, b) => a.localeCompare(b))
                .join(", ")
            : "",
          orbit: sat.orbit
            ? sat.orbit.map((entry) => entry.orbit).join(", ")
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
          });
          break;
        case "names":
          setSelector({
            "names.name": { $regex: `${filterBy.value}`, $options: "i" },
          });
          break;
        case "[object Object]":
          setSelector({
            noradID: { $in: Meteor.user().favorites },
          });
          break;
        case "types":
          setSelector({
            "types.type": { $regex: `${filterBy.value}`, $options: "i" },
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
      setSelector({});
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
        case "types":
          e[0].sort === "asc" ? setSortType(-1) : setSortType(1);
          break;
        case "orbit":
          e[0].sort === "asc" ? setSortOrbit(-1) : setSortOrbit(1);
          break;
        default:
          break;
      }
    } else {
      setSortNorad(0);
      setSortNames(0);
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
      return setSelector({ noradID: { $in: Meteor.user().favorites } });
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
        field: "orbit",
        headerName: "ORBIT(S)",
        minWidth: 150,
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
    setOpenVisualize(true);
    debounced(false);
  };

  function handleDashboard(e, id) {
    e.preventDefault();
    history.push(`/${id}`);
    debounced(false);
  }

  const AddSatelliteButton = () => {
    return (
      <Grid
        container
        item
        xs
        justifyContent={width > 650 ? "flex-end" : "flex-start"}
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
          {width > 650 ? (
            <ProtectedFunctionality
              component={AddSatelliteButton}
              loginRequired={true}
            />
          ) : null}
        </Grid>
        {width < 650 ? (
          <div style={{ margin: "10px 0px 20px 0px" }}>
            <ProtectedFunctionality
              component={AddSatelliteButton}
              loginRequired={true}
            />
          </div>
        ) : null}
        <Typography
          gutterBottom
          variant="body2"
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
        <Typography
          variant="body2"
          className={classes.showKey}
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? "Hide Key..." : "Show Key..."}
        </Typography>
        {showKey && (
          <React.Fragment>
            {Meteor.userId() && (
              <Typography gutterBottom variant="body2" className={classes.key}>
                <StarIcon fontSize="small" className={classes.keyItemsStar} />
                <span className={classes.keyItems}>–</span>
                Add a satellite to your favorites list
              </Typography>
            )}
            <Typography gutterBottom variant="body2" className={classes.key}>
              <VisibilityIcon fontSize="small" className={classes.keyItems} />
              <span className={classes.keyItems}>–</span>
              Open a satellite to view and/or modify the fields or schemas
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <DashboardIcon fontSize="small" className={classes.keyItems} />
              <span className={classes.keyItems}>–</span>
              Open the satellite dashboard - allows users to view satellite data
              outside of an editing modal and provide users with a shareable URL
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <img
                src="/assets/saberastro.png"
                width="21px"
                height="21px"
                className={classes.keyItems}
              />
              <span className={classes.keyItems}>–</span> Open a satellite to
              view and/or modify its schemas or entries
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <MouseIcon fontSize="small" className={classes.keyItems} />
              <span className={classes.keyItems}>–</span> Hover or Click to view
              satellite description, Double-click to view and/or modify a
              satellite's schemas or entries
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <VerifiedIcon
                fontSize="small"
                className={classes.keyItemsValid}
              />
              <ValidatedIcon
                fontSize="small"
                className={classes.keyItemsValid}
              />
              <span className={classes.keyItems}>–</span> Indicates that
              information has been verified to be in the reference or validated
              across multiple sources by user(s) AND web-crawling algorithm(s)
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <ReportIcon
                fontSize="small"
                className={classes.keyItemsPartial}
              />
              <ReportOutlinedIcon
                fontSize="small"
                className={classes.keyItemsPartial}
              />
              <span className={classes.keyItems}>–</span> Indicates that
              information has been verified to be in the reference or validated
              across multiple sources by user(s) OR web-crawling algorithm(s)
            </Typography>
            <Typography gutterBottom variant="body2" className={classes.key}>
              <ErrorIcon fontSize="small" className={classes.keyItemsInvalid} />
              <ErrorOutlinedIcon
                fontSize="small"
                className={classes.keyItemsInvalid}
              />
              <span className={classes.keyItems}>–</span> Indicates that
              information has NOT been verified to be in the reference or
              validated across multiple sources by user(s) OR web-crawling
              algorithm(s)
            </Typography>
          </React.Fragment>
        )}
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
