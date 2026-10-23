export const workshopResourceLinks = {
  "daily-dsa-arrays": "https://visualgo.net/en/array",
  "daily-web-layout": "https://developer.mozilla.org/en-US/docs/Learn_web_development",
  "daily-sql-queries": "https://sqlbolt.com/",
} as const;

export function isValidHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}
