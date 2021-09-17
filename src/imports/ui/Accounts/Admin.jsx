import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { AdminModal } from "./AdminModal";

// @material-ui
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Tooltip,
} from "@material-ui/core";
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

export const Admin = () => {
  Meteor.subscribe("roles");
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState([]);

  const [roles, rows, users, loading] = useTracker(() => {
    const roles = Roles.getRolesForUser(Meteor.userId());
    const sub = Meteor.subscribe("userList");
    const users = Meteor.users.find({}).fetch();
    const rows = users.map((user) => {
      return {
        id: user._id,
        username: user.username,
        emails: user.emails?.map((email) => email.address).join(", "),
        // roles: user.roles?.map((role) => role).join(", ")
        roles: Roles.getRolesForUser(user._id)
          .map((role) => role)
          .join(", "),
      };
    });
    return [roles, rows, users, !sub.ready()];
  });

  const columns = [
    {
      headerAlign: "center",
      field: "id",
      headerName: "ID",
      minWidth: 150,
    },
    {
      headerAlign: "center",
      field: "username",
      headerName: "Username",
      minWidth: 300,
      editable: false,
    },
    {
      headerAlign: "center",
      field: "emails",
      headerName: "Emails",
      minWidth: 300,
      editable: false,
    },
    {
      headerAlign: "center",
      field: "roles",
      headerName: "Roles",
      minWidth: 300,
      editable: false,
    },
  ];

  const handleOpen = (e) => {
    // setEditUser(e)
    console.log("edit user", editUser);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addUserToRole = (user, role) => {
    Meteor.call("addUserToRole", user, role, (res, err) =>
      console.log(res, err)
    );
  };

  const deleteAccount = (id) => {
    Meteor.call("deleteAccount", id, (res, err) => {
      console.log(res, err);
    });
  };

  const removeRole = (id, role) => {
    Meteor.call("removeRole", id, role, (res, err) => {
      console.log(res, err);
    });
  };

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs>
          {roles?.indexOf("admin") !== -1 ? (
            <div>
              <DataGrid
                // className={classes.dataGrid}
                // components={{
                //   Toolbar: CustomToolbar,
                // }}
                rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                columns={columns}
                rows={rows}
                rowCount={10}
                loading={loading}
                autoHeight={true}
                pagination
                disableSelectionOnClick
                onRowClick={(e) => {
                  handleOpen(e.row);
                  // setEditUser(e.row)
                  setEditUser(Meteor.users.find({ _id: e.row.id }).fetch()[0]);
                  console.log(e.row);
                }}
              />
            </div>
          ) : (
            <>{loading}</>
          )}
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
            <b>Roles</b>
            <br />
            {Roles.getRolesForUser(editUser._id).map((role, index) => {
              return (
                <p key={index}>
                  {role}
                  <Button
                    onClick={() => removeRole(editUser._id, role)}
                    color="primary"
                    autoFocus
                  >
                    Remove
                  </Button>
                </p>
              );
            })}

            <br />
            <Button
              onClick={() => addUserToRole(editUser.username, "moderator")}
              color="primary"
              autoFocus
            >
              Make Moderator
            </Button>
            <Button
              onClick={() => addUserToRole(editUser.username, "admin")}
              color="primary"
              autoFocus
            >
              Make Admin
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => addUserToRole(editUser.username, "dummies")}
            color="secondary"
          >
            Ban
          </Button>
          <Button onClick={() => deleteAccount(editUser._id)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <AdminModal
      // show={open}
      // newSat={newSat}
      // initValues={initialSatValues}
      // handleClose={() => setOpen(false)}
      />
    </div>
  );
};
