const { getValueFromProp } = require("../core/mapEntity");

describe("Core map entity", () => {
  it("Check getValueFromProp function", () => {
    expect(getValueFromProp("person.name", {
      person: {
        name: "Gigi",
      }
    })).toBe("Gigi");
  });
});
  