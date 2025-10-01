function setNumberOfCodes() {
    let number_of_codes = document.querySelector("#app pre").innerText.trim().split("\n").filter(c => c.length > 0).length;
    document.getElementById("number_of_codes").innerText = number_of_codes;
}

if (localStorage.getItem("safeEmail") != null || undefined) {
    safeEmail = localStorage.getItem("safeEmail");
    getFirebaseData(`/${safeEmail}/password`).then(firebasePassword => {
        document.getElementById("email").value = convertToUserAcceptableData(safeEmail);
        document.getElementById("password").value = convertToUserAcceptableData(firebasePassword);
    });

    document.getElementById("auth-card").style.display = "none";
    document.getElementById("app").style.display = "unset";

    getCodes();
}

function signIn() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let passwordlessLogin = document.getElementById("passwordlessLogin").checked;

    safeEmail = convertToFirebaseAcceptableData(email);
    let safePassword = convertToFirebaseAcceptableData(password);

    if (!email || !password) {
        document.getElementById("message").style.display = "block";
        document.getElementById("message_label").innerText = "Please fill in all fields.";
        return;
    }

    getFirebaseData(`/${safeEmail}/password`).then(firebasePassword => {
        if (firebasePassword == null || undefined) {
            document.getElementById("message").style.display = "block";
            document.getElementById("message_label").innerText = "Account not found. Check your email address and try again.";
        }
        else {
            if (firebasePassword == safePassword) {
                document.getElementById("auth-card").style.display = "none";
                document.getElementById("app").style.display = "unset";
                getCodes();
                if (passwordlessLogin) {
                    localStorage.setItem("safeEmail", safeEmail);
                }
            }
            else {
                document.getElementById("message").style.display = "block";
                document.getElementById("message_label").innerText = "Incorrect Password. Please Try Again.";
            }
        }
    });
}

function getCodes() {
    let codesPre = document.querySelector("#app pre");
    codesPre.innerText = "";
    getFirebaseData(`/${safeEmail}/codes`).then(data => {
        for (let i = 1; i < data.length; i++) {
            codesPre.innerText += data[i] + '\n';
        }
        setNumberOfCodes();
    });
}

function setCodes() {
    let codesTextarea = document.querySelector("#app textarea").value.trim().split("\n").filter(c => c.length > 0);

    getFirebaseData(`/${safeEmail}/codes`).then(data => {
        let objLen = data.length;
        for (let i = objLen; i < (codesTextarea.length + objLen); i++) {
            setFirebaseData(`/${safeEmail}/codes`, i, codesTextarea[i - objLen]);
            document.querySelector("#app pre").innerText += codesTextarea[i - objLen] + "\n";
        }
        setNumberOfCodes();
    });

    document.querySelector("#app textarea").value = "";
}

function deleteCodes(message) {
    let confirmation = confirm("Are you sure you want to " + message + " all backup codes?");
    if (confirmation) {
        removeFirebaseData(`/${safeEmail}`, 'codes');
        setFirebaseData(`/${safeEmail}`, 'codes/0', "control");
        document.querySelector("#app pre").innerText = "";
        setNumberOfCodes();
    }
}

function copyACode() {
    let obj = document.querySelector("#app pre").innerText.trim().split("\n").filter(c => c.length > 0);
    let objLen = obj.length;
    if (objLen != 0) {
        navigator.clipboard.writeText(obj[objLen - 1]).then(() => {
            removeFirebaseData(`/${safeEmail}/codes`, objLen);
            let data = document.querySelector("#app pre").innerText.replace(`${obj[objLen - 1]}\n`, "");
            document.querySelector("#app pre").innerText = data;
            setNumberOfCodes();
        });
    }
    else {
        alert("No Codes Available.")
    }
}