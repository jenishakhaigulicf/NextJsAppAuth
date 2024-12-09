"use server";

const signup = async (_, formData) => {
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
};

export default signup;
