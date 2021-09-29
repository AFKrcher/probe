import React, { useState } from "react";
// Imports
import { useTracker } from "meteor/react-meteor-data";
import { UsersCollection } from "../../api/users";

// @material-ui
import { Button, Grid, makeStyles } from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    padding: "15px 10px 15px 10px",
  },
  dataGrid: {
    padding: "5px 5px 5px 5px",
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

  const [roles, rows, loading] = useTracker(() => {
    const roles = Roles.getRolesForUser(Meteor.userId());
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
    return [roles, rows, !sub.ready()];
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
      (res, err) => console.log(res, err) // TODO: Use snackbar and alert
    );
  };

  const deleteAccount = (id) => {
    Meteor.call("deleteAccount", id, (res, err) => {
      console.log(res, err); // TODO: Use snackbar and alert
    });
    setOpen(false);
  };

  const removeRole = (user, role) => {
    Meteor.call("removeRole", user, role, (res, err) => {
      console.log(res, err); // TODO: Use snackbar and alert
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
            pagination
            disableSelectionOnClick
            onRowDoubleClick={(e) => {
              handleOpen(e.row);
              setEditUser(Meteor.users.find({ _id: e.row.id }).fetch()[0]);
            }}
          />
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Manage {editUser.username}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>Roles</span>
            <br />
            {Roles.getRolesForUser(editUser._id).map((role, index) => {
              return (
                <span key={index}>
                  {role}
                  <Button
                    onClick={() => removeRole(editUser, role)}
                    color="primary"
                    autoFocus
                  >
                    Remove
                  </Button>
                </span>
              );
            })}

            <br />
            <Button
              onClick={() => addUserToRole(editUser, "moderator")}
              color="primary"
              autoFocus
            >
              Make Moderator
            </Button>
            <Button
              onClick={() => addUserToRole(editUser, "admin")}
              color="primary"
              autoFocus
            >
              Make Admin
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => addUserToRole(editUser, "dummies")}
            color="secondary"
          >
            Ban
          </Button>
          <Button onClick={() => deleteAccount(editUser._id)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
