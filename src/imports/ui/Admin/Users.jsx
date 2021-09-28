import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";

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
  dataGrid: {
    margin: "5px 10px 5px 10px",
    border: "none",
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
  const [limiter, setLimiter] = useState(10);

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
    const users = Meteor.users.find({}).fetch();
    console.log(users);
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
    Meteor.call("addUserToRole", user, role, (res, err) =>
      console.log(res, err)
    );
  };

  const deleteAccount = (id) => {
    Meteor.call("deleteAccount", id, (res, err) => {
      console.log(res, err);
    });
    setOpen(false);
  };

  const removeRole = (id, role) => {
    Meteor.call("removeRole", id, role, (res, err) => {
      console.log(res, err);
    });
  };

  return (
    <React.Fragment>
      <Grid container justifyContent="space-between" alignItems="center">
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
                    onClick={() => removeRole(editUser._id, role)}
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
