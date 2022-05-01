// split cookies into a dictionary
var cookies = {}
var docCookies = document.cookie.split('; ')
for (var i = 0; i != docCookies.length; i++) {
    var a = docCookies[i].indexOf('=')
    var b = [docCookies[i].slice(0, a), docCookies[i].slice(a + 1)]
    if (b[1] != null) cookies[b[0]] = b[1]
}

// Review
var reviews = null
var reviewMyReview = document.getElementById("reviewMyReview")
var reviewEditButton = document.getElementById("reviewEditButton")
var reviewNotLoggedIn = document.getElementById("reviewNotLoggedIn")
var reviewFormPrompt = document.getElementById("reviewFormPrompt")
var reviewForm = document.getElementById("reviewForm")
var reviewsListing = document.getElementById("reviewsListing")

if (document.cookie != "") { // if logged in, display prompt for form
    reviewFormPrompt.style.display = "block"
    reviewMyReview.style.display = "none"
    reviewNotLoggedIn.style.display = "none"
    reviewForm.style.display = "none"
}
else {
    reviewFormPrompt.style.display = "none"
    reviewMyReview.style.display = "none"
    reviewNotLoggedIn.style.display = "block"
    reviewForm.style.display = "none"
}

// show form
var reviewFormPromptButton = document.getElementById("reviewFormPromptButton")
reviewFormPromptButton.onclick = function () {
    reviewFormPrompt.style.display = "none"
    reviewForm.style.display = "block"
}

var reviewFormOptions = {
    liked: 1,
    easy: 1,
    useful: 1,
    anonymous: 0,
}

// Review Form Rating Buttons
// Liked
var reviewLiked1 = document.getElementById("reviewLiked1")
var reviewLiked2 = document.getElementById("reviewLiked2")
var reviewLiked3 = document.getElementById("reviewLiked3")
var reviewLiked4 = document.getElementById("reviewLiked4")
var reviewLiked5 = document.getElementById("reviewLiked5")
reviewLiked1.onclick = function () { reviewFormOptions.liked = 1 }
reviewLiked2.onclick = function () { reviewFormOptions.liked = 2 }
reviewLiked3.onclick = function () { reviewFormOptions.liked = 3 }
reviewLiked4.onclick = function () { reviewFormOptions.liked = 4 }
reviewLiked5.onclick = function () { reviewFormOptions.liked = 5 }

// Easy
var reviewEasy1 = document.getElementById("reviewEasy1")
var reviewEasy2 = document.getElementById("reviewEasy2")
var reviewEasy3 = document.getElementById("reviewEasy3")
var reviewEasy4 = document.getElementById("reviewEasy4")
var reviewEasy5 = document.getElementById("reviewEasy5")
reviewEasy1.onclick = function () { reviewFormOptions.easy = 1 }
reviewEasy2.onclick = function () { reviewFormOptions.easy = 2 }
reviewEasy3.onclick = function () { reviewFormOptions.easy = 3 }
reviewEasy4.onclick = function () { reviewFormOptions.easy = 4 }
reviewEasy5.onclick = function () { reviewFormOptions.easy = 5 }

// Useful
var reviewUseful1 = document.getElementById("reviewUseful1")
var reviewUseful2 = document.getElementById("reviewUseful2")
var reviewUseful3 = document.getElementById("reviewUseful3")
var reviewUseful4 = document.getElementById("reviewUseful4")
var reviewUseful5 = document.getElementById("reviewUseful5")
reviewUseful1.onclick = function () { reviewFormOptions.useful = 1 }
reviewUseful2.onclick = function () { reviewFormOptions.useful = 2 }
reviewUseful3.onclick = function () { reviewFormOptions.useful = 3 }
reviewUseful4.onclick = function () { reviewFormOptions.useful = 4 }
reviewUseful5.onclick = function () { reviewFormOptions.useful = 5 }

// Anonymous
var reviewPostAnonymous = document.getElementById("reviewPostAnonymous")
reviewPostAnonymous.onchange = function () {
    reviewFormOptions.anonymous = (reviewPostAnonymous.checked ? 1 : 0)
}

var reviewFormError = document.getElementById("reviewFormError")
var reviewFormFailure = document.getElementById("reviewFormFailure")

var reviewFormValid = true

var reviewDescription = document.getElementById("reviewDescription")
function checkPostFormValidity() {
    var message = ""
    if (reviewDescription.value.split(" ").length < 6) message += "<li>Please enter 6 or more words for your description.</li>"
    if (reviewFormOptions.liked < 1 || reviewFormOptions.liked > 5) {
        message += "<li>The Liked option was out of range, somehow. Defaulting to 1.</li>"
        reviewFormOptions.liked = 1
    }
    if (reviewFormOptions.easy < 1 || reviewFormOptions.easy > 5) {
        message += "<li>The Easy option was out of range, somehow. Defaulting to 1.</li>"
        reviewFormOptions.easy = 1
    }
    if (reviewFormOptions.useful < 1 || reviewFormOptions.useful > 5) {
        message += "<li>The Useful option was out of range, somehow. Defaulting to 1.</li>"
        reviewFormOptions.useful = 1
    }

    if (message == "") {
        reviewFormValid = true
        reviewFormFailure.innerHTML = ""
    }
    else reviewFormValid = false
}

reviewDescription.onchange = checkPostFormValidity

// post your crafted review
var reviewFormPost = document.getElementById("reviewFormPost")
reviewFormPost.onclick = function () {
    checkPostFormValidity()

    if (reviewFormValid) {
        var request = new XMLHttpRequest();
        request.open("GET", `postReview?username=${cookies.username}&hash=${cookies.hash}&course=${params.get("id")}&liked=${reviewFormOptions.liked}&easy=${reviewFormOptions.easy}&useful=${reviewFormOptions.useful}&anonymous=${reviewFormOptions.anonymous}&description=${reviewDescription.value.replace(/"/g, "'")}`);
        request.send();

        request.onreadystatechange = (e) => {
            if (request.readyState == 4) {
                var response = JSON.parse(request.responseText)
                if (response.success == 1) document.location.reload()
                else reviewDeleteFailure.innerHTML = response.message
            }
        }
    }
    else reviewFormFailure.innerHTML = "Please correct the above fields."
}

// delete own review confirmation
var reviewDeleteConfirmButton = document.getElementById("reviewDeleteConfirmButton")
var reviewDeleteFailure = document.getElementById("reviewDeleteFailure")
reviewDeleteConfirmButton.onclick = function () {
    // attempt to delete review
    var request = new XMLHttpRequest();
    request.open("GET", `deleteReview?course=${params.get("id")}&username=${cookies.username}&hash=${cookies.hash}`);
    request.send();

    request.onreadystatechange = (e) => {
        if (request.readyState == 4) {
            var response = JSON.parse(request.responseText)
            if (response.success == 1) document.location.reload()
            else reviewFormFailure.innerHTML = response.message
        }
    }
}

var reviewCardCourse = document.getElementById("reviewCardCourse")

// course information
var listing = null
var courseBreadcrumb = document.getElementById("courseBreadcrumb")
var courseInfo = document.getElementById("courseInfo")
var courseOfficialPage = document.getElementById("courseOfficialPage")
var params = new URLSearchParams(window.location.search)

function generateInfo() {
    // Generate main course content
    var course = listing[params.get("id")]

    var content = "";
    if (course == null) {
        course = "💀"
        content += "\
            <h1>Course Doesn't Exist</h1> \
            <p>We've reached a dead end!</p>"
    }
    else {
        courseOfficialPage.href = course.url
        content +=
            `<h3>${course.id} - ${course.name}</h3>`

        if (course.tags != null) {
            for (var i = 0; i != course.tags.length; i++) {
                content += `<h5 class="inline"><span class="badge ${tagColours[course.tags[i]]} me-2">${course.tags[i]}</span></h5>`
            }
        }
        else content += `<h5 class="inline"><span class="badge ${tagColours["???"]}">???</span></h5>`

        content += `
            <br>
            <br>
            <p>
                ${course.desc}
            </p>
            <br>`

        if (course.notes != null) {
            content += `
            <h5>💡 Notes</h5>
            <p>
                ${course.notes != null ? course.notes : "None"}
            </p>
            <br>`
        }
        content += `<div class="row">`
        
        if (course.pre != null) {
            content += `
                <div class="col-md-6">
                    <h5><b>📝 Prerequisites</b></h5>
                    <p>${course.pre}</p>
                </div>`
        }
        if (course.anti != null) {
            content += `
                <div class="col-md-6">
                    <h5><b>❌ Antirequisites</b></h5>
                    <p>${course.anti}</p>
                </div>`
        }

        content += `
            </div>`

        reviewCardCourse.innerHTML = course.id
        course = `${course.id} - ${course.name}`


        for (var rep in listing) {
            content = content.replace(new RegExp(listing[rep].idLong, "g"), `<a href="info?id=${rep}">${listing[rep].id}</a>`);
        }

        // Generate reviews
        var reviewContent = ""
        if (reviews != null) {
            for (var i = 0; i != reviews.length; i++) {
                var cardContent = `
                    <div class="d-flex">
                        <div>
                            <img class="profileImage me-4 mb-2" src="https://minokah.github.io/images/icon.png">
                            <p>
                                <b>😀 Liked</b>
                                <br>
                                `
                for (var a = 0; a != reviews[i].liked; a++) cardContent += '⭐'
                cardContent += `</p>
                            <p>
                                <b>📈 Easy</b>
                                <br>`
                for (var a = 0; a != reviews[i].easy; a++) cardContent += '⭐'
                cardContent += `</p>
                            <p>
                                <b>📚 Useful</b>
                                <br>`
                for (var a = 0; a != reviews[i].useful; a++) cardContent += '⭐'
                cardContent += `</p>
                        </div>
                        <div>
                            <h4><b>${reviews[i].username}</b></h4>
                            <p>Posted on ${new Date(reviews[i].posted).toLocaleDateString()}</p>
                            <p>${reviews[i].description}</p>
                        </div>
                    </div>`

                // if own review, set "your review box" and skip
                if (reviews[i].username == cookies.username) {
                    reviewDescription.innerHTML = reviews[i].description
                    
                    reviewPostAnonymous.checked = false
                    if (reviews[i].anonymous) reviewPostAnonymous.checked = true

                    // remove default scores and set chosen scores
                    reviewLiked1.checked = false
                    reviewEasy1.checked = false
                    reviewUseful1.checked = false

                    if (reviews[i].liked == 1) reviewLiked1.checked = true
                    if (reviews[i].liked == 2) reviewLiked2.checked = true
                    if (reviews[i].liked == 3) reviewLiked3.checked = true
                    if (reviews[i].liked == 4) reviewLiked4.checked = true
                    if (reviews[i].liked == 5) reviewLiked5.checked = true
                    if (reviews[i].easy == 1) reviewEasy1.checked = true
                    if (reviews[i].easy == 2) reviewEasy2.checked = true
                    if (reviews[i].easy == 3) reviewEasy3.checked = true
                    if (reviews[i].easy == 4) reviewEasy4.checked = true
                    if (reviews[i].easy == 5) reviewEasy5.checked = true
                    if (reviews[i].useful == 1) reviewUseful1.checked = true
                    if (reviews[i].useful == 2) reviewUseful2.checked = true
                    if (reviews[i].useful == 3) reviewUseful3.checked = true
                    if (reviews[i].useful == 4) reviewUseful4.checked = true
                    if (reviews[i].useful == 5) reviewUseful5.checked = true

                    reviewMyReview.style.display = "block"
                    reviewFormPrompt.style.display = "none"
                    reviewMyReview.innerHTML += cardContent
                    continue
                }
                else {
                    reviewContent += `<li class="list-group-item mt-2">${cardContent}</li>`
                }
            }
        }

        if (reviewContent == "") {
            reviewContent += `
                <li class="list-group-item mt-2">
                    <h5><b>No Other Reviews</b></h5>
                    <p>All reviews (except yours) will show up here.</p>
                </li>`
        }
        reviewsListing.innerHTML = reviewContent
    }

    courseBreadcrumb.innerHTML = course
    courseInfo.innerHTML = content
}

// get course listing from server
var request = new XMLHttpRequest();
request.open("GET", "listing?get=list");
request.send();

request.onreadystatechange = (e) => {
    if (request.readyState == 4) {
        listing = JSON.parse(request.responseText).listing

        var reviewsRequest = new XMLHttpRequest();
        reviewsRequest.open("GET", `getReviews?course=${params.get("id")}`);
        reviewsRequest.send();

        reviewsRequest.onreadystatechange = (e) => {
            if (reviewsRequest.readyState == 4) {
                reviews = JSON.parse(reviewsRequest.responseText)
                if (reviews.success == 0) reviews = null
                else reviews = reviews.reviews
                generateInfo()
            }
        }
    }
}