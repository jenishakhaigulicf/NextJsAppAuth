import db from "./db";

const createUser = (email, password) => {
  const result = db
    .prepare("INSERT INTO users (email, password) VALUES (?,?)")
    .run(email, password);
  return result.lastInsertRowid;
};

export default createUser;
