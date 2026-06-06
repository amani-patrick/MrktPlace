import { amniiConfig } from "./amnii";

export const siteConfig = {
  name: amniiConfig.name,
  description: amniiConfig.description,
  url: amniiConfig.url,
  locale: "en-RW",
  contact: {
    email: "hello@amnii.rw",
    phone: "+250 788 000 000",
  },
} as const;
