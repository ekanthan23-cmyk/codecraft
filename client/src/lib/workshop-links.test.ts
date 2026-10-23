import { describe, expect, it } from "vitest";
import { isValidHttpsUrl, workshopResourceLinks } from "./workshop-links";

describe("workshop links", () => {
  it("keeps the configured study links on HTTPS sources", () => {
    expect(Object.values(workshopResourceLinks).every(isValidHttpsUrl)).toBe(true);
  });

  it("accepts HTTPS meeting links and rejects unsafe protocols", () => {
    expect(isValidHttpsUrl("https://meet.google.com/" )).toBe(true);
    expect(isValidHttpsUrl("https://zoom.us/j/123" )).toBe(true);
    expect(isValidHttpsUrl("javascript:alert(1)" )).toBe(false);
    expect(isValidHttpsUrl("not-a-url" )).toBe(false);
  });
});
