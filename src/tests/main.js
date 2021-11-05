import assert from "assert";
import React from "react";
import { Meteor } from "meteor/meteor";
import { render, screen } from "@testing-library/react";
import { Home } from "../imports/ui/Home.jsx";
import { App } from "../imports/ui/App.jsx";

// Uses mocha to test the Home component
describe("Home", function () {
  it("should render the Home component", function () {
    const { getByText } = render(<App />);
    const linkElement = getByText(/Probe/i);
    expect(linkElement).toBeInTheDocument();
  });
});

describe("App", () => {
  it("does something", () => {
    console.log("hi");
    React.render(<Home />, document.getElementById("app"));
    const app = render(<Home />);
    const childElement = app.getByText("Probe");
    expect(childElement).toBeInTheDocument();
  });
});

describe("probe", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "probe");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
