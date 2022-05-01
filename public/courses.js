// sort buttons
var sort = "none"
var sortNone = document.getElementById("sortNone")
var sortRatings = document.getElementById("sortRatings")
var sortLiked = document.getElementById("sortLiked")

sortNone.onchange = function () {
    sort = "none"
    filter()
}

sortLiked.onchange = function () {
    sort = "liked"
    filter()
}

sortRatings.onchange = function () {
    sort = "ratings"
    filter()
}

// module filter
var moduleMinor = document.getElementById("moduleMinor")
var moduleMajor = document.getElementById("moduleMajor")
var moduleSpec = document.getElementById("moduleSpec")
var moduleHonSpec = document.getElementById("moduleHonSpec")

let module = {
    minor: true,
    major: true,
    spec: true,
    honspec: true
}

moduleMinor.onchange = function () {
    module.minor = moduleMinor.checked
    //filter()
}

moduleMajor.onchange = function () {
    module.major = moduleMajor.checked
    //filter()
}

moduleSpec.onchange = function () {
    module.spec = moduleSpec.checked
    //filter()
}

moduleHonSpec.onchange = function () {
    module.honspec = moduleHonSpec.checked
    //filter()
}

// level filter
var course1000 = document.getElementById("course1000")
var course2000 = document.getElementById("course2000")
var course3000 = document.getElementById("course3000")
var course4000 = document.getElementById("course4000")

let levels = {
    first: true,
    second: true,
    third: true,
    fourth: true
}

course1000.onchange = function () {
    levels.first = course1000.checked
    filter()
}

course2000.onchange = function () {
    levels.second = course2000.checked
    filter()
}

course3000.onchange = function () {
    levels.third = course3000.checked
    filter()
}

course4000.onchange = function () {
    levels.fourth = course4000.checked
    filter()
}

var courseCategoryButton = document.getElementById("courseCategoryButton")
var courseCategoryList = document.getElementById("courseCategoryList")
var category = "all"

var categories = null
var listing = null
var keys = null

var searchResultsFrame = document.getElementById("searchResultsFrame")

// scroll check and limit how much is shown at once
var totalCounted = 0
var endReached = false

function filter(cat, reset = true) {
    if (reset) {
        totalCounted = 0
        endReached = false
    }

    if (cat != null) category = cat // change category

    if (category == "all" || categories[category] == null) courseCategoryButton.innerHTML = "All Categories"
    else courseCategoryButton.innerHTML = `${categories[category]} (${category})`

    var content = ""
    var counted = 0
    for (var a = totalCounted;; a++) {
        var course = keys[a]

        if (course == null) { // reached the end
            endReached = true
            break
        }

        if (counted == 10) {
            totalCounted += 10
            break
        }

        var levelCheck = (levels.first && (listing[course].level == 1)) || (levels.second && (listing[course].level == 2)) || (levels.third && (listing[course].level == 3)) || (levels.fourth && (listing[course].level == 4))
        if ((category == "all" || category == listing[course].cat) && levelCheck) {
            content +=
                `<a href="info?id=${course}" class="list-group-item list-group-item-action d-flex justify-content-between">
                <div>
                    <b>${listing[course].id}</b>
                    <br>
                    ${listing[course].name}
                </div>
                <div class="d-flex flex-column align-items-end">
                    <div class="d-flex">
                    `
            if (listing[course].tags != null) {
                for (var i = 0; i != listing[course].tags.length; i++) {
                    content += `<h5><span class="ms-2 badge ${tagColours[listing[course].tags[i]]}">${listing[course].tags[i]}</span></h5>`
                }
            }
            else content += `<h5 class="inline"><span class="badge ${tagColours["???"]}">???</span></h5>`

            content += `
                    </div>
                    <div class="d-flex">
                        <h5><span class="ms-2 badge bg-primary">0 Rating(s)</span></h5>
                        <h5><span class="ms-2 badge bg-success">100% 😀</span></h5>
                    </div>
                </div>
            </a>
            `
            counted++
        }
    }

    if (content == "" && reset) {
        content = `
            <h3>No results</h3>
            <h5>You turned off the level filter, didn't you?</h5>
        `
    }

    if (reset) searchResultsFrame.innerHTML = content
    else searchResultsFrame.innerHTML += content
}

document.onscroll = function() {
    if (((window.scrollY + window.innerHeight) >= document.body.scrollHeight - 10) && !endReached) {
        filter(category, false)
    }
}


// get listings from server
var request = new XMLHttpRequest();
request.open("GET", "listing");
request.send();

request.onreadystatechange = (e) => {
    if (request.readyState == 4) {
        var data = JSON.parse(request.responseText)
        listing = data.listing
        keys = Object.keys(listing)
        categories = data.cat

        var content = `<li><button class="dropdown-item" onclick="filter('all')">All Categories</button></li>`
        for (var cat in categories) {
            content += `<li><button class="dropdown-item" onclick="filter('${cat}')">${categories[cat]} (${cat})</button></li>`
        }
        courseCategoryList.innerHTML = content

        filter()
    }
}