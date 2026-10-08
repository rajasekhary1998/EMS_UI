// src/services/authService.ts

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await fetch(
    "https://localhost:7189/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  return {
    success: response.ok,
    data,
  };
};