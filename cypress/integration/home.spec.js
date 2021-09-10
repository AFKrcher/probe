context("navbar", () => {
  it("visits site", () => {
    cy.visit("http://localhost:3000");
  });

  it("navbar renders correctly", () => {
    cy.wait(1000);
    cy.get(".MuiButtonBase-root").contains("Home").click();
    cy.get(".MuiButtonBase-root").contains("Satellites").click();
    cy.get(".MuiButtonBase-root").contains("Schemas").click();
    cy.get(".MuiButtonBase-root").contains("About").click();
    cy.get(".MuiButtonBase-root").contains("Home").click();
  });
});

context("satCard", () => {
  it("visits site", () => {
    cy.visit("http://localhost:3000");
  });

  it("opens a data card's visualize feature", () => {
    cy.wait(2000);
    cy.get(".MuiButtonBase-root").contains("Visualize").first().click();
    cy.wait(1000);
    cy.get("p").contains("Visualizing");
    // cy.wait(5000); // wait for Space Cockpit to load
    cy.get("#exitVisualize").click();
  });

  it("opens a data card's data feature", () => {
    cy.wait(1000);
    cy.get(".MuiButtonBase-root").contains("Data").first().click();
    cy.get("p").contains("Editing");
    cy.get("button").contains("Close").click();
  });
});

context("about", () => {
  it("visits site", () => {
    cy.visit("http://localhost:3000/about");
  });

  it("contributor images have a link", () => {
    cy.wait(1000);
    cy.get("#image-0").should(
      "have.attr",
      "href",
      "https://www.linkedin.com/in/nathan-parrott-5a459b41/"
    );
    cy.get("#image-0").should("have.attr", "target", "_blank");
  });
});
