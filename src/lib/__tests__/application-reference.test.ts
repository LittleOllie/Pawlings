import { describe, it, expect } from "vitest";
import { formatApplicationReferenceCode } from "@/lib/application-reference";

describe("formatApplicationReferenceCode", () => {
  it("formats the first code as PAW-0001", () => {
    expect(formatApplicationReferenceCode(1)).toBe("PAW-0001");
  });

  it("zero-pads sequential codes", () => {
    expect(formatApplicationReferenceCode(42)).toBe("PAW-0042");
    expect(formatApplicationReferenceCode(999)).toBe("PAW-0999");
  });

  it("allows numbers beyond four digits", () => {
    expect(formatApplicationReferenceCode(10000)).toBe("PAW-10000");
  });
});
