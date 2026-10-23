import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readProjectFile = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("CodeCraft first-page portal layout contract", () => {
  it("keeps the reference-inspired dashboard sections in the first page", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    expect(home).toContain("Workshop & portal updates");
    expect(home).toContain("Your schedule");
    expect(home).toContain("Monthly tracker");
    expect(home).toContain("Choose your workspace");
    expect(home).toContain("profileDetails");
  });

  it("keeps the adaptive profile drawer and editable learner actions", () => {
    const shell = readProjectFile("client/src/components/StudentPortalShell.tsx");
    for (const label of ["Personal ID", "Professional & education", "About you", "Learning goal", "Edit profile", "Save profile", "My Progress", "Success Coach", "Streak Save", "Help / Contact"]) expect(shell).toContain(label);
    expect(shell).toContain("trpc.codecraft.profile.get");
    expect(shell).toContain("trpc.codecraft.profile.save");
    expect(shell).toContain("setLocation(\"/tutor\")");
  });

  it("keeps the core student navigation routes in the shared shell", () => {
    const shell = readProjectFile("client/src/components/StudentPortalShell.tsx");
    for (const route of ["/", "/workshops", "/projects", "/tutor", "/library", "/developer"]) expect(shell).toContain(`path: "${route}"`);
  });
});
