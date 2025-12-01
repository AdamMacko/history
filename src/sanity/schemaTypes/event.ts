// sanity/schemaTypes/event.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Podujatie",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Názov podujatia",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 80,
      },
    }),
    defineField({
      name: "start",
      title: "Začiatok",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Stručný popis",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "poster",
      title: "Plagát",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "fbUrl",
      title: "FB event (link)",
      type: "url",
    }),
    defineField({
      name: "ticketsUrl",
      title: "Vstupenky (link)",
      type: "url",
    }),
  ],
});
