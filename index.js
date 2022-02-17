const { createModel } = require("xstate/lib/model");
const { createModel: createTestModel } = require("@xstate/test");

const model = createModel(
  {
    searchQuery: "",
    page: 1,
  },
  {
    events: {
      // 👇 `Set search query` event should bring a `searchQuery`.
      "Set search query": (searchQuery) => ({ searchQuery }),
      "Load more": () => ({}),
    },
  }
);

const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBFdYAHAG3QE8CoACGygF2d3bFVgGIAymE6ww6AE45mARwCuYCfUSgqAe1jdca-CpAAPRAFoATAA4zJAKwBmACx2TATgCMt+y4DsAGhDKEdk4kJh5WAGyuAAyRZnZuAL7xvmhYeISkFNR0jPgsbLCc3LwCADJq6BDMqGoSYHrqmuzaukgGxmF21laeLi6RJnY9Vi72vv4uZlYkNiZWdmauYRGRYTOJSSD4ahBweik4BMTklLQMTKwcXDx89RpaOnqGCDZTZjZOcSYuYZ4hVsNjRA2MKJZIYA7pW6NZqPYw2Fwmaz2RyudxxHx+OFhEhOJwxTw9Rz2fHreJAA */
  model.createMachine({
    id: "(machine)",
    initial: "Displaying list items",
    states: {
      "Displaying list items": {
        on: {
          "Set search query": {
            target: "#(machine).Displaying list items",
            actions: model.assign({
              searchQuery: (_context, event) => {
                // 👇 event.searchQuery is undefined
                console.log("searchQuery", event.searchQuery);

                return event.searchQuery;
              },
            }),
          },
          "Load more": {
            cond: (context) => context.page < 3,
            target: "#(machine).Displaying list items",
            actions: model.assign({
              page: (context) => context.page + 1,
            }),
          },
        },
      },
    },
  });

const testModel = createTestModel(machine);

const path = testModel.getPlanFromEvents(
  [
    // 👇 Only `Load more` event needs to be sent to the test model machine.
    { type: "Load more" },
  ],
  {
    target: "Displaying list items",
  }
);
