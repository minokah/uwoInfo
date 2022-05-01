// get course listing from server

var listing = null
var request = new XMLHttpRequest();
request.open("GET", "listing?get=list");
request.send();

request.onreadystatechange = (e) => {
    if (request.readyState == 4) {
        listing = JSON.parse(request.responseText).listing
        startFade()
    }
}

// temporary solution to the search box, runs through EVERYTHING
var courseSearch = document.getElementById("courseSearch")
var courseSearchListing = document.getElementById("courseSearchListing")

// update text box
function checkText() {
    var content = ""
    if (courseSearch.value.length > 0) {
        var query = courseSearch.value.toLowerCase()
        var size = 0
        for (var course in listing) {
            if (listing[course].name.toLowerCase().includes(query) || listing[course].id.toLowerCase().includes(query)) {
                content += `<a href="info?id=${course}" class="list-group-item list-group-item-action" aria-current="true"><b>${listing[course].id}</b> ${listing[course].name}</a>`
                size++;
            }
            if (size >= 5) break;
        }
    }

    courseSearchListing.innerHTML = content
}
courseSearch.onfocus = checkText
courseSearch.onblur = checkText
courseSearch.onkeydown = checkText
courseSearch.onkeyup = checkText

var headerPrompt = document.getElementById("headerPrompt")
function startFade() {
    var keys = Object.keys(listing)
    if (keys.length == 0) return
    headerPrompt.innerHTML = `${listing[keys[Math.floor(Math.random() * keys.length)]].id}` // initial

    setInterval(() => {
        headerPrompt.style.opacity = 0
        setTimeout(() => {
            headerPrompt.innerHTML = `${listing[keys[Math.floor(Math.random() * keys.length)]].id}`
            headerPrompt.style.opacity = 1
        }, 500);
    }, 5000);
}