import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import db from "./db";

const adapter = new BetterSqlite3Adapter(db, {
  // table name
  user: "users",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    // for lucia expiration must be false
    expires: false,
    attributes: {
      // https only in production
      secure: process.env.NODE_ENV === "production",
    },
  },
});
