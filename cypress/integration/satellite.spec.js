import testSat from "../fixtures/testSat.json"

context("satellite", () => {
  it("visits satellites page", () => {
    cy.visit("http://localhost:3000/satellites");
  });

  it("adds satellite", () => {
    cy.get(".MuiButtonBase-root").contains("Add Satellite").click();
    // test noradID input
    cy.get(".Mui-disabled").contains("Save");
    cy.get('[name="noradID"]').type("This is wrong");
    cy.get(".MuiAccordionSummary-content").contains("names").click();
    cy.get("p").contains("Must be a positive number");
    cy.get(".Mui-disabled").contains("Save");
    cy.get('[name="noradID"]').type("{selectall}{backspace}");
    cy.get("p").contains("Required");
    cy.get(".Mui-disabled").contains("Save");
    cy.get('[name="noradID"]').type("25544");
    cy.get("p").contains(
      "A satellite with noradID of 25544 already exists in our records."
    );
    cy.get(".Mui-disabled").contains("Save");
    cy.get('[name="noradID"]').type(`{selectall}${testSat.noradID}`);
    // test name entry input
    cy.get(".MuiButtonBase-root").contains("Add Entry").click();
    cy.get('[name="names.0.name"]').type(`${testSat.name}`);
    cy.get("span").contains("URL Required");
    cy.get(".Mui-disabled").contains("Save");
    cy.get('[name="names.0.name"]').type("{selectall}{backspace}");
    cy.get("span").contains("String Required");
    cy.get(".Mui-disabled").contains("Save");
    cy.get('[name="names.0.name"]').type(`${testSat.name}`);
    cy.get('[name="names.0.reference"]').type("This is wrong");
    cy.get("span").contains("Must be a valid URL");
    cy.get('[name="names.0.reference"]').type(`{selectall}${testSat.ref}`);
    cy.get("span").contains("Must be a valid URL").should("not.exist");
    cy.get("span").contains("URL Required").should("not.exist");
    cy.get("span").contains("String Required").should("not.exist");
    //test save button
    cy.get(".MuiButtonBase-root").contains("Save").click();
    cy.get(".MuiSnackbarContent-root").contains(`${testSat.name} saved`);
  });

  it("datagrid filters", () => {
    // filter by noradID
    cy.get("span").contains("Filters").click();
    cy.get('[placeholder="Filter value"]')
      .type(`${testSat.noradID}`, { force: true })
      .wait(1000)
      .trigger("keydown", { keyCode: 27 });
    cy.get(".MuiDataGrid-cell").should("have.length", 3);
    cy.get(".MuiDataGrid-cell").first().contains(`${testSat.noradID}`);
    // filter by name
    cy.get("span").contains("Filters").click();
    cy.get(".MuiGridFilterForm-columnSelect").within(() => {
      cy.get("select").select("NAME(S)");
    });
    cy.get('[placeholder="Filter value"]')
      .type(`${testSat.name}`, { force: true })
      .wait(1000)
      .trigger("keydown", { keyCode: 27 });
    cy.get(".MuiDataGrid-cell").should("have.length", 3);
    cy.get(".MuiDataGrid-cell").contains(`${testSat.name}`);
  });

  it("edits satellite", () => {
    cy.visit("http://localhost:3000/satellites");
    cy.get(".MuiDataGrid-cell").contains(`${testSat.noradID}`).click();
    cy.get(".MuiButtonBase-root").contains("Edit").click();
    cy.get(".Mui-disabled").contains("Save");
    cy.get(".MuiButton-label").contains("Add Schema").click();
    cy.get("#mui-component-select-satellite-field").click();
    cy.get(".Mui-disabled").contains("+ Add");
    // add an entry
    // cy.get("li").contains("type").click();
    // cy.get("#add-schema").click();
    cy.get('.schemaIndex').each((value, index, collection) =>{
      if(!cy.get(value).contains('.Mui-disabled')){
        cy.wrap(value).click()
        cy.get("#add-schema").click();
        cy.get(".MuiButton-label").contains("Add Schema").click();
        cy.get("#mui-component-select-satellite-field").click();
        cy.get(".Mui-disabled").contains("+ Add");
      }
    })


    // cy.get(".MuiAccordionSummary-content")
    // .contains("type").click();
    // cy.get(".Mui-expanded").within(() => {
    //   cy.get("button").contains("+ Add Entry").click();
    // });
    // cy.get('[aria-labelledby="mui-component-select-type.0.type"]').click();
    // cy.get("li").contains("unknown").click();
    // cy.get("span").contains("URL Required");
    // cy.get('[name="type.0.reference"]').type("This is wrong");
    // cy.get("span").contains("Must be a valid URL");
    // cy.get('[name="type.0.reference"]').type(`{selectall}${testSat.ref}`);
    // cy.get(".MuiButtonBase-root").contains("Save").click();
    // cy.get(".MuiSnackbarContent-root").contains(`${testSat.name} saved`);
  });

  it("deletes satellite", () => {
    cy.visit("http://localhost:3000/satellites");
    cy.wait(1000);
    cy.get(".MuiDataGrid-cell").contains(`${testSat.noradID}`).click();
    cy.get(".MuiButtonBase-root").contains("Delete").click();
    cy.get(".MuiDialogActions-root ").within(() => {
      cy.get(".MuiButton-containedSecondary")
        .contains("Confirm")
        .click({ force: true });
    });
  });
});
