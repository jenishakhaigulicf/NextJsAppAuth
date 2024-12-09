"use server";

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { getUserByEmail, createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export const signup = async (_, formData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 character long";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // store it in the db
  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword);
    createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "User with the email already exist",
        },
      };
    }
    throw error;
  }
};

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    return {
      errors: {
        email:
          "Could not authenticate the user, please check the credentials   ",
      },
    };
  }
  const isValidPassword = verifyPassword(existingUser.password, password);
  if (!isValidPassword) {
    return {
      errors: {
        password:
          "Could not authenticate the user, please check the credentials",
      },
    };
  }
  await createAuthSession(existingUser.id);
  redirect("/training");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
