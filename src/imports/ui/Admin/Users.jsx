import React, { useState, useContext } from "react";
import { Meteor } from "meteor/meteor";
// Imports
import { Roles } from "meteor/alanning:roles";
import HelpersContext from "../Dialogs/HelpersContext.jsx";
import { useTracker } from "meteor/react-meteor-data";
import { UsersCollection } from "../../api/users";
import AlertDialog from "../Dialogs/AlertDialog.jsx";

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
  IconButton,
  Typography,
  Divider,
  Paper
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from "@material-ui/data-grid";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    width: "100%",
    padding: "15px 10px 15px 10px"
  },
  dataGrid: {
    backgroundColor: theme.palette.grid.background,
    "& .MuiDataGrid-row": {
      cursor: "pointer"
    },
    "& .MuiDataGrid-cell": {
      textOverflow: "clip"
    },
    "& .MuiCircularProgress-colorPrimary": {
      color: theme.palette.text.primary
    }
  },
  toolbar: {
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: "14px"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    margin: "-15px -25px 10px -25px"
  },
  rolesTitle: {
    marginBottom: 10
  },
  rolesContainer: {
    margin: 5
  },
  rolesRow: {
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: -10
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10
  },
  actionButton: {
    marginRight: 10,
    marginLeft: 10
  }
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
        <GridToolbarExport
          className={classes.toolbar}
          csvOptions={{
            fileName: `${new Date().toISOString()}_PROBE_UsersTable.json`
          }}
        />
      </GridToolbarContainer>
    );
  }

  const [rows, users, loading] = useTracker(() => {
    const sub = Meteor.subscribe("userList");
    const users = UsersCollection.find().fetch();
    const rows = users.map((user) => {
      return {
        id: user._id,
        username: user.username,
        emails: user.emails?.map((email) => email.address).join(", "),
        roles: Roles.getRolesForUser(user._id)
          .map((role) => role)
          .join(", ")
      };
    });
    return [rows, users, !sub.ready()];
  });

  const columns = [
    {
      headerAlign: "center",
      field: "id",
      headerName: "USER ID",
      minWidth: 250
    },
    {
      headerAlign: "center",
      field: "username",
      headerName: "USERNAME",
      minWidth: 250,
      editable: false
    },
    {
      headerAlign: "center",
      field: "emails",
      headerName: "EMAIL",
      minWidth: 250,
      editable: false
    },
    {
      headerAlign: "center",
      field: "roles",
      headerName: "ROLE(S)",
      editable: false,
      flex: 1
    }
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
      (err, res) => {
        if (err || res) console.log(err?.reason || res?.toString());
      } // TODO: Use snackbar and alert
    );
  };

  const deleteAccount = (id) => {
    Meteor.call("deleteAccount", id, (err, res) => {
      if (err || res) console.log(err?.reason || res?.toString()); // TODO: Use snackbar and alert
    });
    setOpen(false);
  };

  const removeRole = (user, role) => {
    Meteor.call("removeRole", user, role, (err, res) => {
      if (err || res) console.log(err?.reason || res?.toString()); // TODO: Use snackbar and alert
    });
  };

  const { alert, setAlert, setOpenAlert } = useContext(HelpersContext);
  const verifyChange = (user, role) => {
    setAlert({
      title: <span>{role === "dummies" ? "Ban user" : "Delete user"}</span>,
      text: (
        <span>
          {role === "dummies"
            ? `Are you sure you want to ban ${user?.username || "N/A"}?`
            : `Are you sure you want to permanently delete ${user?.username || "N/A"}?`}
        </span>
      ),
      actions: (
        <Button
          variant="contained"
          size="small"
          color="secondary"
          disableElevation
          onClick={() => {
            role === "dummies" ? (addUserToRole(user, role), setOpenAlert(false)) : (deleteAccount(user?._id), setOpenAlert(false));
          }}>
          Confirm
        </Button>
      ),
      closeAction: " Cancel"
    });
    setOpenAlert(true);
  };

  return (
    <React.Fragment>
      <AlertDialog bodyAlert={alert} />
      <Grid container justifyContent="space-between" className={classes.root}>
        <Grid item xs>
          <Paper elevation={5}>
            <DataGrid
              className={classes.dataGrid}
              components={{
                Toolbar: CustomToolbar
              }}
              rowsPerPageOptions={[10, 15, 20, 50, 100]}
              columns={columns}
              rows={rows}
              loading={loading}
              autoHeight={true}
              rowCount={rows.length}
              pagination
              disableSelectionOnClick
              onRowDoubleClick={(e) => {
                handleOpen(e.row);
                setEditUser(users.find((user) => user._id === e.row.id));
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <DialogTitle>
            <div className={classes.modalHeader}>
              <Typography variant="h5">
                Managing <b>{editUser?.username || "N/A"}</b>
              </Typography>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContentText className={classes.rolesContainer}>
            <Grid container display="flex" justifyContent="flex-end" alignItems="center">
              <Grid item xs={12} className={classes.rolesTitle}>
                <Typography variant="h6">
                  <b>Roles:</b>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider className={classes.divider} variant="inset" orientation="horizontal" />
              </Grid>
              {Roles.getRolesForUser(editUser?._id).map((role, index) => {
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={7} className={classes.rolesRow}>
                      {role}
                    </Grid>
                    <Grid item xs={4} className={classes.rolesRow}>
                      <Button variant="contained" onClick={() => removeRole(editUser, role)} color="secondary" size="small">
                        Remove
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider className={classes.divider} variant="inset" orientation="horizontal" />
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            className={classes.actionButton}
            variant="contained"
            onClick={() => verifyChange(editUser, "dummies")}
            color="secondary"
            disabled={Roles.getRolesForUser(editUser?._id).includes("admin")}>
            Ban
          </Button>
          <Button
            className={classes.actionButton}
            variant="contained"
            onClick={() => verifyChange(editUser, "delete")}
            color="secondary"
            disabled={Roles.getRolesForUser(editUser?._id).includes("admin")}>
            Delete
          </Button>
          <Button
            className={classes.actionButton}
            variant="contained"
            onClick={() => addUserToRole(editUser, "moderator")}
            color="primary"
            autoFocus
            disabled={Roles.getRolesForUser(editUser?._id).includes("moderator")}>
            Make Moderator
          </Button>
          <Button
            className={classes.actionButton}
            variant="contained"
            onClick={() => addUserToRole(editUser, "admin")}
            color="primary"
            autoFocus
            disabled={Roles.getRolesForUser(editUser?._id).includes("admin")}>
            Make Admin
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
