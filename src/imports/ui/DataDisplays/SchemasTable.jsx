import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import useWindowSize from "../Hooks/useWindowSize.jsx";
import { SchemaCollection } from "../../api/schemas";
import ProtectedFunctionality from "../utils/ProtectedFunctionality.jsx";

// Components
import { Link } from "react-router-dom";
import { SchemaModal } from "../SchemaModal/SchemaModal.jsx";

// @material-ui
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Tooltip,
  IconButton,
  TextField,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  description: {
    marginBottom: 25,
    marginTop: 10,
  },
  dataGrid: {
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: theme.palette.grid.background,
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

  const [showModal, setShowModal] = useState(false);
  const [newSchema, setNewSchema] = useState(true);
  const [initialSchemaValues, setInitialSchemaValues] =
    useState(newSchemaValues);

  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  const [filter, setFilter] = useState("");
  const [rows, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find().fetch();
    const searchRegex = new RegExp(escapeRegExp(filter), "i");
    const rows = schemas
      .filter((schema) =>
        filter
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
    return [rows, !sub.ready()];
  });

  const handleAddNewSchema = () => {
    setNewSchema(true);
    setShowModal(true);
    setInitialSchemaValues(newSchemaValues);
  };

  const handleRowClick = (schemaObject) => {
    setNewSchema(false);
    setShowModal(true);
    setInitialSchemaValues(schemaObject);
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
        a number of data fields that contain the actual information. Click on a
        desired <strong>schema</strong> below to view its details and edit the
        entry fields.
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search Schemas…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={classes.textField}
        InputProps={{
          startAdornment: (
            <SearchIcon fontSize="small" style={{ marginRight: 5 }} />
          ),
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              onClick={() => setFilter("")}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
      <DataGrid
        className={classes.dataGrid}
        columns={columns}
        rows={rows}
        loading={isLoading}
        autoHeight={true}
        disableSelectionOnClick
        onRowClick={(schema) => {
          handleRowClick(schema.row.columns);
        }}
      />
      <SchemaModal
        show={showModal}
        newSchema={newSchema}
        initValues={initialSchemaValues}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
};
