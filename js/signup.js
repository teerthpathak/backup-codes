function signUp() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let privacypolicy_and_termsandconditions = document.getElementById("privacypolicy_and_termsandconditions").checked;
    let passwordlessLogin = document.getElementById("passwordlessLogin").checked;

    if (!email || !password || !confirmPassword) {
        document.getElementById("message").style.display = "block";
        document.getElementById("message_label").innerText = "Please fill in all fields.";
        return;
    }

    if (password != confirmPassword) {
        document.getElementById("message").style.display = "block";
        document.getElementById("message_label").innerText = "Passwords do not match.";
        return;
    }

    if (!privacypolicy_and_termsandconditions) {
        document.getElementById("message").style.display = "block";
        document.getElementById("message_label").innerText = "Please accept the Privacy Policy and Terms & Conditions.";
        return;
    }

    let safeEmail = convertToFirebaseAcceptableData(email);
    let safePassword = convertToFirebaseAcceptableData(password);
    getFirebaseData(`/${safeEmail}/password`).then(firebasePassword => {
        if (firebasePassword != null || undefined) {
            document.getElementById("message").style.display = "block";
            document.getElementById("message_label").innerText = "Account already exists. Please sign in.";
        } else {
            setFirebaseData(`/${safeEmail}`, "password", safePassword);
            setFirebaseData(`/${safeEmail}`, "codes/0", "control");

            if (passwordlessLogin) {
                localStorage.setItem("safeEmail", safeEmail);
            }

            document.getElementById("message").style.color = "green";
            document.getElementById("message").style.display = "block";
            document.getElementById("message_label").innerText = "Account created successfully! Redirecting to Sign In...";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }
    });
}