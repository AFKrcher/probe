const assert = require("chai").assert;
const app = require("../src/App.jsx");

describe("App", () => {
  it("should return something", () => {
    assert.equal(app(), "something");
  });
});
