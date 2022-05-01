function generateModules(div, list) {
    var content = "";
    for (var module in list) {
        content +=
            `<div class="accordion-item">
                <h2 class="accordion-header" id="accordionHeading-${list[module].id}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#accordionCollapse-${list[module].id}" aria-expanded="false"
                        aria-controls="accordionCollapse-${list[module].id}">
                        <span>${module}</span>
                    </button>
                </h2>
                <div id="accordionCollapse-${list[module].id}" class="accordion-collapse collapse"
                    aria-labelledby="accordionHeading-${list[module].id}">
                    <div class="accordion-body">
                        <br>
                        <h3 class="inline">${module}</h3>
                        <br>
                        <h5>${list[module].credits} credits</h5>
                        ${list[module].description}
                        <br>
                        <a href="info?id=${module}"><button type="button" class="btn btn-primary">Full Module Page</button></a>
                        <button type="button" class="btn btn-primary">Official Module Page</button>
                    </div>
                </div>
            </div> `
    }

    div.innerHTML = formatCourseLinks(content);
}

generateModules(document.getElementById("accordionAdmission"), admission);
generateModules(document.getElementById("accordionModules"), modules);
