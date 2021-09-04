describe("Testing suit test examples", () => {
  test("Test 1", () => {
    const func = (a: number): number => a + 1

    expect(func(3)).toBe(4);
  });
});