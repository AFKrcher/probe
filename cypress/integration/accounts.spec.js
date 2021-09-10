context("user-management", () => {
  let username = "fake2";
  let email = "fake2@email.com";
  let password = "P4ssw0rd!";
  let newPassword = "N3wP4ssw0rd!";

  it("visits site", () => {
    cy.visit("http://localhost:3000");
  });

  //Register user
  it("Registers an account", () => {
    cy.register(email, username, password);
    cy.wait(1000);
  });

  //logs out
  it("Logs out", () => {
    cy.logout();
  });

  //logs in
  it("Logs in", () => {
    cy.login(username, password);
  });

  //change settings
  it("Changes settings", () => {
    cy.wait(1000);
    cy.settings();
    // cy.get('#newEmail').type('1')
    cy.get("#newUsername").type("1");
    cy.get("#oldPassword").type(password);
    cy.get("#newPassword").type(newPassword);
    cy.get("#confirm").type(newPassword);
    cy.get("#updateButton").click();
    cy.logout();
    cy.wait(1000);
    //logs in with new settings
    cy.login(`${username}1`, newPassword);
    cy.settings();
    //reverts
    cy.get("#newEmail").type("{backspace}");
    cy.get("#newUsername").type("{backspace}");
    cy.get("#oldPassword").type(newPassword);
    cy.get("#newPassword").type(password);
    cy.get("#confirm").type(password);
    cy.get("#updateButton").click();
  });

  //deletes user
  it("Deletes user", () => {
    cy.visit("http://localhost:3000");
    cy.get("body").trigger("keydown", { keyCode: 27 });
    cy.login(username, password);
    cy.deleteUser();
    cy.on("fail", (err) => {
      console.log(err);
      cy.login(`${username}1`, newPassword);
      cy.deleteUser();
    });
  });
});