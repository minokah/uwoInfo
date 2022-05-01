var axios = require('axios')
var cheerio = require('cheerio')

// cached scraped entries
var listing = {}

async function generateCourseListing() {
   var data = require("./data")
   var categories = data.courseCategories
   var tags = data.courseTags

   for (var cat in categories) {
      try {
         console.log(`Scraping course listing for ${cat}`)
         var { data } = await axios.get(
            `https://www.westerncalendar.uwo.ca/Courses.cfm?Subject=${cat}&SelectedCalendar=Live&ArchiveID=`
         )
         var $ = cheerio.load(data)

         $('.col-md-12 > .panel-group > .panel').each((i, course) => {
            var reg = new RegExp(categories[cat], "g") // COMPSCI -> Computer Science

            var entry = {}
            entry.cat = cat // COMPSCI
            entry.url = "https://westerncalendar.uwo.ca/" + $(".panel-collapse > .panel-body > .col-xs-12 > a", course).attr("href")

            // get course number, full id
            var cut = $(".panel-heading > h4", course).text().replace(reg, cat).split(' ') // Computer Science 1026A/B ... -> COMPSCI 1026A/B -> ["COMPSCI", "1026A/B"]
            entry.id = cut[0] + " " + cut[1]
            entry.idLong = categories[cat] + " " + cut[1]
            
            if (cut[1][0] == "1") entry.level = 1
            if (cut[1][0] == "2") entry.level = 2
            if (cut[1][0] == "3") entry.level = 3
            if (cut[1][0] == "4") entry.level = 4

            entry.courseNumber = cut[1].replace(/\n|\t|F\/G\/Y|F\/G\/Z|A\/B\/Y|A\/B|F\/G|F|G|Y|Z/g, "")
            cut.shift()
            cut.shift()

            entry.name = cut.join(" ")
            $(".panel-collapse > .panel-body > .col-xs-12 > div", course).each((i, body) => {
               if (i == 0) entry.desc = $(body).text()//.replace(reg, cat)

               try {
                  if ($("strong", body).text() == "Antirequisite(s):") {
                     entry.anti = $(body).text().replace("Antirequisite(s): ", "")
                  }
                  else if ($("strong", body).text() == "Prerequisite(s):") {
                     entry.pre = $(body).text().replace("Prerequisite(s): ", "")
                  }
               }
               catch { }
            })

            var entryID = entry.cat + entry.courseNumber
            if (tags[entryID] != null) entry.tags = tags[entryID]
            listing[entryID] = entry;
         })
      }
      catch (error) {
         console.log(`Scraping failed for ${cat}!`)
      }
   }
   console.log(listing)
}
generateCourseListing()

module.exports = listing