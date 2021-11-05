import testUser from "../fixtures/testUser.json";

context("user-management", () => {
  it("visits site", () => {
    cy.visit("http://localhost:3000");
  });

  //Register user
  it("Registers an account", () => {
    cy.register(testUser.email, testUser.username, testUser.password);
    cy.wait(1000);
  });

  //logs out
  it("Logs out", () => {
    cy.logout();
  });

  //logs in
  it("Logs in", () => {
    cy.login(testUser.username, testUser.password);
  });

  //change settings
  it("Changes settings", () => {
    cy.wait(1000);
    cy.settings();
    cy.get("#newUsername").type("1");
    cy.get("#oldPassword").type(testUser.password);
    cy.get("#newPassword").type(testUser.newPassword);
    cy.get("#confirm").type(testUser.newPassword);
    cy.get("#updateButton").click();
    cy.logout();
    cy.wait(1000);
    //logs in with new settings
    cy.login(`${testUser.username}1`, testUser.newPassword);
    cy.settings();
    //reverts
    cy.get("#newEmail").type("{backspace}");
    cy.get("#newUsername").type("{backspace}");
    cy.get("#oldPassword").type(testUser.newPassword);
    cy.get("#newPassword").type(testUser.password);
    cy.get("#confirm").type(testUser.password);
    cy.get("#updateButton").click();
  });

  //deletes user
  it("Deletes user", () => {
    cy.visit("http://localhost:3000");
    cy.get("body").trigger("keydown", { keyCode: 27 });
    cy.login(testUser.username, testUser.password);
    cy.deleteUser();
    cy.on("fail", (err) => {
      console.log(err);
      cy.login(`${testUser.username}1`, testUser.newPassword);
      cy.deleteUser();
    });
  });
});
