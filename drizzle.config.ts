import { defineConfig } from "drizzle-kit";

// Only `db:push`/`db:studio` need a live connection; `db:generate` just
// diffs the schema against existing migrations, so don't hard-fail here.
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
