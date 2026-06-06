import { amniiConfig } from "./amnii";

export const siteConfig = {
  name: amniiConfig.name,
  description: amniiConfig.description,
  url: amniiConfig.url,
  locale: "en-RW",
  contact: {
    email: "hello@amnii.rw",
    phone: "+250 795 674 182",
    whatsapp: "+250795674182",
    whatsappDisplay: "0795 674 182",
  },
} as const;
