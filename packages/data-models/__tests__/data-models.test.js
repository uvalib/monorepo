"use strict";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

import { catalog } from "../lib/data-models.js";

describe("catalog", () => {
  let cat;
  beforeAll(() => {
    cat = new catalog();
  });

  // Did we get authenticated?
  test("hasauth", () => {
    expect(cat.isAuthenticated());
  });
});
