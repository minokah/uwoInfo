var redirecting = false

var profileHeader = document.getElementById("profileHeader")
var profileInformation = document.getElementById("profileInformation")

// split cookies into a dictionary
var cookies = {}
var docCookies = document.cookie.split('; ')
for (var i = 0; i != docCookies.length; i++) {
    var a = docCookies[i].indexOf('=')
    var b = [docCookies[i].slice(0, a), docCookies[i].slice(a + 1)]
    if (b[1] != null) cookies[b[0]] = b[1]
}

if (document.cookie == "") {
    profileHeader.innerHTML = "Not logged in"
    profileInformation.innerHTML = "<p>You either just logged out, or somehow found this page... (in that case you should create an account, it's free)</p>"
}
else {
    profileHeader.innerHTML = `${cookies.username}'s Profile`
    //profileInformation.innerHTML = "<p>This page is under construction. No, you cannot change your password yet. Or do anything on this page. Sorry!</p>"
}

/*

    Change Password Form

*/

var changePasswordValid = false
var changePasswordError = document.getElementById("changePasswordError")
var changePasswordOld = document.getElementById("changePasswordOld")
var changePassword = document.getElementById("changePassword")
var changePasswordConfirm = document.getElementById("changePasswordConfirm")
var changePasswordFailure = document.getElementById("changePasswordFailure")
var reviewDeleteConfirmButton = document.getElementById("reviewDeleteConfirmButton")

function checkPasswordChangeValidity() {
    var message = ""
    if (changePasswordOld.value.length < 6) message += "<li>Your old password must be at least 6 characters.</li>"
    if (changePassword.value.length < 6) message += "<li>Please enter a new password with 6 or more characters.</li>"
    if (changePasswordConfirm.value != changePassword.value) message += "<li>Your new passwords do not match.</li>"
    if (message == "") {
        changePasswordValid = true
        changePasswordFailure.innerHTML = ""
    }
    else changePasswordValid = false
    changePasswordError.innerHTML = message
}

reviewDeleteConfirmButton.onclick = function() {
    if (redirecting) return
    checkPasswordChangeValidity()

    if (changePasswordValid) {
        var request = new XMLHttpRequest();
        request.open("GET", `changePassword?username=${cookies.username}&hash=${cookies.hash}&old=${changePasswordOld.value}&new=${changePassword.value}`);
        request.send();

        request.onreadystatechange = (e) => {
            if (request.readyState == 4) {
                var response = JSON.parse(request.responseText)
                if (response.success == 1) {
                    redirecting = true
                    document.cookie = `hash=${response.hash}`
                    changePasswordFailure.style.color = "green"
                    changePasswordFailure.innerHTML = "Password changed, refreshing..."
                    
                    setTimeout(() => {
                        document.location.reload()
                    }, 2000);                    
                }
                else changePasswordFailure.innerHTML = response.message
            }
        }
    }
    else changePasswordFailure.innerHTML = "Please correct the above fields."
}

changePasswordOld.onblur = checkPasswordChangeValidity
changePassword.onblur = checkPasswordChangeValidity
changePasswordConfirm.onblur = checkPasswordChangeValidity

/*

    Delete Account Form

*/

var deleteAccountValid = false
var deleteAccountError = document.getElementById("deleteAccountError")
var deleteAccountUsername = document.getElementById("deleteAccountUsername")
var deleteAccountCookie = document.getElementById("deleteAccountCookie")
var deleteAccountFailure = document.getElementById("deleteAccountFailure")
var deleteAccountConfirmButton = document.getElementById("deleteAccountConfirmButton")

function checkDeleteAccountValidity() {
    var message = ""
    if (deleteAccountUsername.value != cookies.username) message += "<li>Your username does not match.</li>"
    if (deleteAccountCookie.value != "cookie") message += "<li>The confirm word isn't 'cookie'.</li>"
    if (message == "") {
        deleteAccountValid = true
        deleteAccountFailure.innerHTML = ""
    }
    else deleteAccountValid = false
    deleteAccountError.innerHTML = message
}

deleteAccountConfirmButton.onclick = function() {
    if (redirecting) return
    checkDeleteAccountValidity()

    if (deleteAccountValid) {
        var request = new XMLHttpRequest();
        request.open("GET", `deleteAccount?username=${cookies.username}&hash=${cookies.hash}`);
        request.send();

        request.onreadystatechange = (e) => {
            if (request.readyState == 4) {
                var response = JSON.parse(request.responseText)
                if (response.success == 1) {
                    redirecting = true
                    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                    document.cookie = "hash=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                    deleteAccountFailure.style.color = "green"
                    deleteAccountFailure.innerHTML = "Account deleted, redirecting..."
                    
                    setTimeout(() => {
                        document.location.href = "/"
                    }, 2000);                    
                }
                else deleteAccountFailure.innerHTML = response.message
            }
        }
    }
    else deleteAccountFailure.innerHTML = "Please correct the above fields."
}

deleteAccountUsername.onblur = checkDeleteAccountValidity
deleteAccountCookie.onblur = checkDeleteAccountValidity