import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../../api/schemas";
import ProtectedFunctionality from "../utils/ProtectedFunctionality.jsx";
import useWindowSize from "../Hooks/useWindowSize.jsx";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

// Components
import { SearchBar } from "./SearchBar.jsx";
import { Link } from "react-router-dom";
import { SchemaModal } from "../SchemaModal/SchemaModal.jsx";
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
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MouseIcon from "@material-ui/icons/Mouse";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
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
  dataGrid: {
    padding: "5px 5px 0px 5px",
    backgroundColor: theme.palette.grid.background,
    marginTop: 5,
    "& .MuiDataGrid-cell": {
      textOverflow: "ellipse",
    },
    "& .MuiCircularProgress-colorPrimary": {
      color: theme.palette.text.primary,
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
  },
  actionIconButton: {
    padding: 7,
    marginLeft: 37.5,
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
  textField: {
    marginBottom: 20,
    backgroundColor: theme.palette.grid.background,
  },
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
      required: true,
    },
    {
      name: "verified",
      hidden: true,
      description: "",
      type: "string",
      allowedValues: ["true", "false"],
    },
  ],
};

export const SchemasTable = () => {
  const classes = useStyles();

  const [width] = useWindowSize();

  const [popperBody, setPopperBody] = useState(null);
  const [showPopper, setShowPopper] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newSchema, setNewSchema] = useState(true);
  const [selector, setSelector] = useState("");
  const [initialSchemaValues, setInitialSchemaValues] =
    useState(newSchemaValues);
  const [showKey, setShowKey] = useState(false);

  const debounced = useDebouncedCallback((cell) => {
    if (
      cell.field === "description" &&
      cell.colDef.computedWidth / cell.value.length < 6.3
    ) {
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
      $or: [
        {
          isDeleted: false,
        },
        {
          isDeleted: undefined,
        },
      ],
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
          description: schema.description,
        };
      });
    return [rows, schemas, !sub.ready()];
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
      <Grid
        container
        item
        xs
        justifyContent={width > 650 ? "flex-end" : "flex-start"}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewSchema}
        >
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
                      _id: schema.id,
                    }).fetch()[0]
                  )
                }
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </span>
        );
      },
    },
    {
      headerAlign: "left",
      field: "name",
      headerName: "SCHEMA NAME",
      width: 200,
      editable: false,
    },
    {
      headerAlign: "left",
      field: "description",
      headerName: "SCHEMA DESCRIPTION",
      flex: 1,
      minWidth: 200,
      editable: false,
    },
  ];

  return (
    <div className={classes.root}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <Typography variant="h3">Schemas</Typography>
        </Grid>
        <Grid container item xs justifyContent="flex-end">
          {width > 650 ? (
            <ProtectedFunctionality
              component={AddSchemaButton}
              loginRequired={true}
            />
          ) : null}
        </Grid>
        {width < 650 ? (
          <div style={{ margin: "10px 0px 10px 0px" }}>
            {
              <ProtectedFunctionality
                component={AddSchemaButton}
                loginRequired={true}
              />
            }
          </div>
        ) : null}
      </Grid>
      <Typography gutterBottom variant="body2" className={classes.description}>
        Each <strong>schema</strong> is built to store sets of data that
        characterize a satellite. Please see the satellites on the{" "}
        <Tooltip title="Bring me to the schemas page">
          <Link to="/satellites" className={classes.link}>
            previous page
          </Link>
        </Tooltip>{" "}
        for usage examples. Each <strong>schema</strong> has a reference for
        where the data was found, a description describing what the data is, and
        a number of data fields that contain the information. Double-click on a
        desired <strong>schema</strong> below to view its details and edit the
        entry fields.
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
          <Typography gutterBottom variant="body2" className={classes.key}>
            <VisibilityIcon fontSize="small" className={classes.keyItems} />
            <span className={classes.keyItems}>–</span>
            Open a schema to view and/or modify its fields
          </Typography>
          <Typography gutterBottom variant="body2" className={classes.key}>
            <MouseIcon fontSize="small" className={classes.keyItems} />
            <span className={classes.keyItems}>–</span> Hover or Click to view
            schema description, Double-click to view and/or modify a schema's
            fields
          </Typography>
        </React.Fragment>
      )}
      <SearchBar
        setSelector={setSelector}
        multiple={false}
        placeholder="Search by name or description"
      />
      <DataGrid
        className={classes.dataGrid}
        columns={columns}
        rows={rows}
        loading={isLoading}
        autoHeight={true}
        disableSelectionOnClick
        components={{
          Toolbar: CustomToolbar,
        }}
        onRowDoubleClick={(row) => {
          handleRowDoubleClick(schemas.find((item) => item._id === row.row.id));
        }}
        onCellOver={debounced}
        onRowOut={() => debounced(false)}
      />
      <Popper open={showPopper} value={popperBody} />
      <SchemaModal
        show={showModal}
        newSchema={newSchema}
        initValues={initialSchemaValues}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};
