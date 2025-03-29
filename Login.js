document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (name === "" || password === "") {
      document.getElementById("error-message").textContent =
        "Both fields are required.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
      });

      const result = await response.json();

      if (response.status === 200) {
        window.location.href = result.redirectUrl;
      } else {
        document.getElementById("error-message").textContent = result.message;
      }
    } catch (error) {
      document.getElementById("error-message").textContent =
        "An error occurred during login.";
    }
  });
