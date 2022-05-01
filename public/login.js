var navSignupLoginButton = document.getElementById("navSignupLoginButton")
var navProfileContainer = document.getElementById("navProfileContainer")
var navProfileImage = document.getElementById("navProfileImage")
var navProfileName = document.getElementById("navProfileName")
var navProfileLogout = document.getElementById("navProfileLogout")

var cookies = {}
var docCookies = document.cookie.split('; ')
for (var i = 0; i != docCookies.length; i++) {
    var a = docCookies[i].indexOf('=')
    var b = [docCookies[i].slice(0, a), docCookies[i].slice(a + 1)]
    if (b[1] != null) cookies[b[0]] = b[1]
}

if (document.cookie != "") { // is logged in
    navSignupLoginButton.style.display = "none"
    navProfileContainer.style.display = "block"

    navProfileImage.src = "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg" // look up 'dog' on google images
    navProfileName.innerHTML = cookies.username
}
else {
    navSignupLoginButton.style.display = "block"
    navProfileContainer.style.display = "none"
}

// regex
var emailRegex = /^.+@.+\..+$/
var alphanumRegex = /^[0-9a-zA-Z]+$/

// Log in
var loginValid = true
var loginError = document.getElementById("loginError")
var loginUsername = document.getElementById("loginUsername")
var loginPassword = document.getElementById("loginPassword")
var loginFailure = document.getElementById("loginFailure")
var loginButton = document.getElementById("loginButton")

function checkLoginValidity() {
    var message = ""
    if (loginUsername.value.length == 0) message += "<li>Please enter a username.</li>"
    if (loginPassword.value.length < 6) message += "<li>Please enter a password with 6 or more characters.</li>"
    if (message == "") {
        loginValid = true
        loginFailure.innerHTML = ""
    }
    else loginValid = false
    loginError.innerHTML = message
}
loginUsername.onblur = checkLoginValidity
loginPassword.onblur = checkLoginValidity

loginButton.onclick = function () {
    checkLoginValidity()
    
    if (loginValid) { // send only if valid
        var request = new XMLHttpRequest();
        request.open("GET", `loginAccount?username=${loginUsername.value}&password=${loginPassword.value}`);
        request.send();

        request.onreadystatechange = (e) => {
            if (request.readyState == 4) {
                var response = JSON.parse(request.responseText)
                if (response.success == 1) { // 1 for success
                    document.cookie = `username=${loginUsername.value}`
                    document.cookie = `hash=${response.hash}`
                    document.location.reload()
                }
                else loginFailure.innerHTML = response.message
            }
        }
    }
    else loginFailure.innerHTML = "Please correct the above fields."
}

// Sign up
var signupValid = true
var signupError = document.getElementById("signupError")
var signupUsername = document.getElementById("signupUsername")
var signupEmail = document.getElementById("signupEmail")
var signupPassword = document.getElementById("signupPassword")
var signupPasswordConfirm = document.getElementById("signupPasswordConfirm")
var signupFailure = document.getElementById("signupFailure")
var signupButton = document.getElementById("signupButton")

function checkSignupValidity() {
    var message = ""
    if (signupUsername.value.length == 0) message += "<li>Please enter a username.</li>"
    if (!signupUsername.value.match(alphanumRegex)) message += "<li>Your username cannot have spaces or invalid characters.</li>"
    if (!emailRegex.test(signupEmail.value)) message += "<li>Please enter a valid email.</li>"
    if (signupPassword.value.length < 6) message += "<li>Please enter a password with 6 or more characters.</li>"
    if (signupPasswordConfirm.value != signupPassword.value) message += "<li>Your passwords do not match.</li>"
    if (message == "") {
        signupValid = true
        signupFailure.innerHTML = ""
    }
    else signupValid = false
    signupError.innerHTML = message
}

signupUsername.onblur = checkSignupValidity
signupEmail.onblur = checkSignupValidity
signupPassword.onblur = checkSignupValidity
signupPasswordConfirm.onblur = checkSignupValidity

signupButton.onclick = function () {
    checkSignupValidity()
    
    if (signupValid) { // send only if valid
        var request = new XMLHttpRequest();
        request.open("GET", `createAccount?username=${signupUsername.value}&email=${signupEmail.value}&password=${signupPassword.value}`);
        request.send();

        request.onreadystatechange = (e) => {
            if (request.readyState == 4) {
                var response = JSON.parse(request.responseText)
                
                if (response.success == 1) { // 1 for success
                    document.cookie = `username=${signupUsername.value}`
                    document.cookie = `hash=${response.hash}`
                    document.location.reload()
                }
                else signupFailure.innerHTML = response.message
            }
        }
    }
    else signupFailure.innerHTML = "Please correct the above fields."
}

navProfileLogout.onclick = function() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "hash=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.location.reload()
}

var accountForgotFrame = document.getElementById("accountForgotFrame")
accountForgotFrame.innerHTML = `<div class="mt-3 mx-2"><p>This section isn't actually finished yet. Sorry!</p></div>`