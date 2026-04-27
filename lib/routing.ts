import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "kz"],
  defaultLocale: "ru",
  pathnames: {
    "/": "/",
    "/ask": "/ask",
    "/questions/[id]": "/questions/[id]",
    "/subjects/[slug]": "/subjects/[slug]",
  },
});
