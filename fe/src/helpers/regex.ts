export const handleRegexEmail = (email: string) => {
  const isValid = /^[a-zA-Z0-9._%+-]+@students\.um\.ac\.id$/.test(email);

  if (!isValid) {
    return { error: "Gunakan email students.um.ac.id" };
  } else {
    return { error: "" };
  }
};
