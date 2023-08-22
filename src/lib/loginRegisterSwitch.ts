const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const goToRegisterButton = document.getElementById("goToRegister");
const goToLoginButton = document.getElementById("goToLogin");

if (loginForm && registerForm && goToRegisterButton && goToLoginButton) {
  registerForm.style.display = "none";

  goToRegisterButton.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
  });

  goToLoginButton.addEventListener("click", () => {
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
  });
}
