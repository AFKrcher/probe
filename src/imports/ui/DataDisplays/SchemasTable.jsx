import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import ProtectedFunctionality from "../Helpers/ProtectedFunctionality.jsx";
import useWindowSize from "../Hooks/useWindowSize.jsx";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";
import { jsonDownload } from "../utils/commonDataFuncs";

// Components
import { SearchBar } from "../Helpers/SearchBar.jsx";
import { Link } from "react-router-dom";
import { SchemaModal } from "../SchemaModal/SchemaModal.jsx";
import { Popper } from "../Dialogs/Popper.jsx";
import { Key } from "../Helpers/Key.jsx";

// @material-ui
import { Button, Grid, makeStyles, Typography, Tooltip, IconButton } from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from "@material-ui/data-grid";
import VisibilityIcon from "@material-ui/icons/Visibility";
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
    display: "flex"
  },
  actionIconButton: {
    padding: 7,
    marginLeft: 37,
    filter: `drop-shadow(1px 2px 1px ${theme.palette.tertiary.shadow})`
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
  textField: {
    marginBottom: 20,
    backgroundColor: theme.palette.grid.background
  }
}));

const newSchemaValues = {
  name: "",
  description: "",
  fields: [
    {
      name: "reference",
      hidden: true,
      type: "url",
      allowedValues: [],
      required: true
    },
    {
      name: "verified",
      hidden: true,
      description: "",
      type: "verified"
    },
    {
      name: "validated",
      hidden: true,
      type: "validated",
      required: true
    }
  ]
};

// breakpoints based on device width / height
const addButtonBreak = 650;

export const SchemasTable = () => {
  const classes = useStyles();

  const [width] = useWindowSize();

  const [popperBody, setPopperBody] = useState(null);
  const [showPopper, setShowPopper] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newSchema, setNewSchema] = useState(true);
  const [selector, setSelector] = useState("");
  const [limiter, setLimiter] = useState(20);
  const [initialSchemaValues, setInitialSchemaValues] = useState(newSchemaValues);

  const debounced = useDebouncedCallback((cell) => {
    if (cell.field === "description" && cell.colDef.computedWidth / cell.value.length < 6.3) {
      setShowPopper(true);
      setPopperBody(cell.value);
    } else {
      setShowPopper(false);
    }
  }, 300);

  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  const [rows, schemas, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find({
      isDeleted: false
    }).fetch();
    const searchRegex = new RegExp(escapeRegExp(selector), "i");
    const rows = schemas
      .filter((schema) =>
        selector
          ? Object.keys(schema).some((field) => {
              return searchRegex.test(schema[field].toString());
            })
          : schema
      )
      .map((schema) => {
        return {
          id: schema._id,
          name: schema.name,
          description: schema.description
        };
      });
    return [rows, schemas, !sub.ready()];
  });

  function CustomToolbar() {
    return (
      <div className={classes.toolbarSpacer}>
        <GridToolbarContainer className={classes.toolbarContainer}>
          <GridToolbarColumnsButton className={classes.toolbar} />
          <GridToolbarFilterButton className={classes.toolbar} />
          <GridToolbarDensitySelector className={classes.toolbar} />
          <Button size="small" onClick={() => jsonDownload(schemas)} className={classes.downloadBar} color="primary">
            <Download fontSize="small" className={classes.downloadIcon} />
            {width > addButtonBreak ? "Export JSON" : "JSON"}
          </Button>
        </GridToolbarContainer>
      </div>
    );
  }
  const handleAddNewSchema = () => {
    setNewSchema(true);
    setShowModal(true);
    setInitialSchemaValues(newSchemaValues);
    debounced(false);
  };

  const handleRowDoubleClick = (schemaObject) => {
    setNewSchema(false);
    setShowModal(true);
    setInitialSchemaValues(schemaObject);
    debounced(false);
  };

  const AddSchemaButton = () => {
    return (
      <Grid container item xs justifyContent={width > addButtonBreak ? "flex-end" : "flex-start"}>
        <Button variant="contained" color="primary" onClick={handleAddNewSchema}>
          + Add Schema
        </Button>
      </Grid>
    );
  };

  const columns = [
    {
      headerAlign: "center",
      filterable: false,
      sortable: false,
      field: "actions",
      headerName: "ACTIONS",
      width: 150,
      align: "left",
      renderCell: function renderCellButtons(schema) {
        return (
          <span className={classes.actions}>
            <Tooltip title="View Schema" arrow placement="top">
              <IconButton
                className={classes.actionIconButton}
                onClick={() =>
                  handleRowDoubleClick(
                    SchemaCollection.find({
                      _id: schema.id
                    }).fetch()[0]
                  )
                }>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </span>
        );
      }
    },
    {
      headerAlign: "left",
      field: "name",
      headerName: "SCHEMA NAME",
      width: 200,
      editable: false
    },
    {
      headerAlign: "left",
      field: "description",
      headerName: "SCHEMA DESCRIPTION",
      flex: 1,
      minWidth: 200,
      editable: false
    }
  ];

  return (
    <div className={classes.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Typography variant="h3">Schemas</Typography>
        </Grid>
        <Grid container item xs justifyContent="flex-end">
          {width > addButtonBreak ? <ProtectedFunctionality component={AddSchemaButton} loginRequired={true} /> : null}
        </Grid>
        {width < addButtonBreak ? (
          <div style={{ margin: "10px 0px 10px 0px" }}>{<ProtectedFunctionality component={AddSchemaButton} loginRequired={true} />}</div>
        ) : null}
      </Grid>
      <Typography gutterBottom variant="body1" className={classes.description}>
        Each <b>schema</b> is built to store sets of data that characterize a satellite. Please see the satellites on the{" "}
        <Tooltip placement="top" arrow title="Bring me to the schemas page">
          <Link to="/satellites" className={classes.link}>
            satellites page
          </Link>
        </Tooltip>{" "}
        for usage examples. Each <b>schema</b> has a reference for where the data was found, a description describing what the data is, and a number
        of data fields that contain the information.
      </Typography>
      <Key page="SchemasTable" />
      <div className={classes.searchBarContainer}>
        <SearchBar setSelector={setSelector} multiple={false} placeholder="Search by name or description" />
      </div>
      <DataGrid
        className={classes.dataGrid}
        columns={columns}
        rows={rows}
        pageSize={limiter}
        rowsPerPageOptions={[20, 40, 60, 120]}
        onPageSizeChange={(newLimit) => setLimiter(newLimit)}
        loading={isLoading}
        autoHeight={true}
        disableSelectionOnClick
        components={{
          Toolbar: CustomToolbar
        }}
        onRowDoubleClick={(row) => {
          handleRowDoubleClick(schemas.find((item) => item._id === row.row.id));
        }}
        onCellOver={debounced}
        onRowOut={() => debounced(false)}
      />
      <Popper open={showPopper} value={popperBody} />
      <SchemaModal show={showModal} newSchema={newSchema} initValues={initialSchemaValues} handleClose={() => setShowModal(false)} />
    </div>
  );
};
