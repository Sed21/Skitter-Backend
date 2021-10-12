import { Validator } from '../../src/utils';

describe("Test validator utility", () => {
  test("username: valid username", () => {
    const example = "valid123"
    expect(Validator.username(example)).toBeTruthy()
  })

  test("username: invalid username", () => {
    const example = "v a !@#!%$"
    expect(Validator.username(example)).toBeFalsy()
  })
});