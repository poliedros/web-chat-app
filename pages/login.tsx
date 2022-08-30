import React, { useState } from "react";
import useUser from "lib/useUser";
import Layout from "components/Layout";
import fetchJson, { FetchError } from "lib/fetchJson";

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  });

  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const body = {
      username: event.currentTarget.username.value,
    };

    try {
      mutateUser(
        await fetchJson("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      );
    } catch (error) {
      if (error instanceof FetchError) {
        setErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  return (
    <Layout>
      <div>Login</div>
    </Layout>
  );
}
