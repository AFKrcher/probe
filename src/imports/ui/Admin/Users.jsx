import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { UsersCollection } from "../../api/users";

// @material-ui
import {
  Button,
  Grid,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
    display: "flex",
    height: "100%",
    width: "100%",
    padding: "15px 10px 15px 10px",
  },
  dataGrid: {
    padding: "5px 5px 5px 5px",
    backgroundColor: theme.palette.grid.background,
    overflowY: "auto",
    "& .MuiDataGrid-cell": {
      textOverflow: "clip",
    },
    "& .MuiCircularProgress-colorPrimary": {
      color: theme.palette.text.primary,
    },
  },
  toolbar: {
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: "14px",
  },
}));

export const Users = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState([]);

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

  const [rows, loading] = useTracker(() => {
    const sub = Meteor.subscribe("userList");
    let users = UsersCollection.find().fetch();
    if (!Meteor.userId()) users = [];
    const rows = users.map((user) => {
      return {
        id: user._id,
        username: user.username,
        emails: user.emails?.map((email) => email.address).join(", "),
        roles: Roles.getRolesForUser(user._id)
          .map((role) => role)
          .join(", "),
      };
    });
    return [rows, !sub.ready()];
  });

  const columns = [
    {
      headerAlign: "center",
      field: "id",
      headerName: "USER ID",
      minWidth: 250,
    },
    {
      headerAlign: "center",
      field: "username",
      headerName: "USERNAME",
      minWidth: 250,
      editable: false,
    },
    {
      headerAlign: "center",
      field: "emails",
      headerName: "EMAIL",
      minWidth: 250,
      editable: false,
    },
    {
      headerAlign: "center",
      field: "roles",
      headerName: "ROLE(S)",
      editable: false,
      flex: 1,
    },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addUserToRole = (user, role) => {
    Meteor.call(
      "addUserToRole",
      user,
      role,
      (err, res) => console.log(err, res) // TODO: Use snackbar and alert
    );
  };

  const deleteAccount = (id) => {
    Meteor.call("deleteAccount", id, (err, res) => {
      console.log(err, res); // TODO: Use snackbar and alert
    });
    setOpen(false);
  };

  const removeRole = (user, role) => {
    Meteor.call("removeRole", user, role, (err, res) => {
      console.log(err, res); // TODO: Use snackbar and alert
    });
  };

  return (
    <React.Fragment>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className={classes.root}
      >
        <Grid item xs>
          <DataGrid
            className={classes.dataGrid}
            components={{
              Toolbar: CustomToolbar,
            }}
            rowsPerPageOptions={[10, 15, 20, 50, 100]}
            columns={columns}
            rows={rows}
            loading={loading}
            autoHeight={true}
            rowCount={rows.length}
            pagination
            disableSelectionOnClick
            autoHeight
            onRowDoubleClick={(e) => {
              handleOpen(e.row);
              setEditUser(Meteor.users.find({ _id: e.row.id }).fetch()[0]);
            }}
          />
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} minWidth="md">
        <DialogTitle>
          Managing User: <strong>{editUser.username}</strong>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span>Roles</span>
            {Roles.getRolesForUser(editUser._id).map((role, index) => {
              return (
                <span key={index}>
                  {role}
                  <Button
                    variant="contained"
                    onClick={() => removeRole(editUser, role)}
                    color="primary"
                    autoFocus
                  >
                    Remove
                  </Button>
                </span>
              );
            })}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={() => addUserToRole(editUser, "moderator")}
            color="primary"
            autoFocus
          >
            Make Moderator
          </Button>
          <Button
            variant="contained"
            onClick={() => addUserToRole(editUser, "admin")}
            color="primary"
            autoFocus
          >
            Make Admin
          </Button>
          <Button
            variant="contained"
            onClick={() => addUserToRole(editUser, "dummies")}
            color="secondary"
          >
            Ban
          </Button>
          <Button
            variant="contained"
            onClick={() => deleteAccount(editUser._id)}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
