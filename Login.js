document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!name || !password) {
      errorMessage.textContent = "All fields are required.";
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
        // Redirect based on role
        window.location.href = result.redirectUrl;
      } else {
        errorMessage.textContent = result.message || "Login failed.";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage.textContent = "An error occurred during login.";
    }
  });

  // Optional: Signup button handler
  document.getElementById("signup_frwd")?.addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:5500/Signup.html";
  });
});
