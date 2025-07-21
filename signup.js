document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("signupForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (name === "" || password === "") {
        document.getElementById("error-message").textContent =
          "All fields are required.";
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, password })
        });

        const result = await response.json();

        if (response.status === 201) {
          document.getElementById("success-message").textContent =
            "Account created successfully!";
          document.getElementById("error-message").textContent = "";
        } else {
          document.getElementById("error-message").textContent =
            result.message || "Failed to sign up.";
          document.getElementById("success-message").textContent = "";
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("error-message").textContent =
          "An error occurred during sign-up.";
      }
    });

  document.getElementById("login_frwd")?.addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:5500/Login.html";
  });
});
