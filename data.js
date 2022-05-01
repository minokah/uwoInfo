var admission = {
    "Admission Requirements": {
        id: "admission",
        credits: "2.0",
        description: "\
        <ul>\
            <li>Pick <b>ANY 0.5</b> and get at least a <b>65%</b> in: CS 1025, CS 1026 OR CS 1037</li> \
            <br> \
            <li>Pick <b>ANY 0.5</b> and get at least a <b>65%</b> in:</li> \
            <ul> \
                <li>CS 1027 (if you took CS 1025 or CS 1026)</li> \
                <li>CS 1036 (if you took CS 1036)</li> \
            </ul> \
            <br> \
            <li>Pick <b>ANY 1.0</b> and get at least a <b>60%</b> in: MATH 1201, CALC 1000, CALC 1301, CALC 1500, CALC 1501, MATH 1600, MATH 1411, MATH 1412, OR MATH 1414</li> \
            Note: Courses such as CS 3388, CS 4442, and CS 4482 require CS 1600 as a prerequisite. \
        </ul>\
        "
    }
}

var modules = {
    "Major": {
        id: "major",
        credits: "6.0",
        description: "\
            <ul>\
            <li>Take <b>ALL (3.5)</b> of: CS 2208, CS 2209, CS 2210, CS 2211, CS 2212, CS 3305, CS 3307</li> \
            <li>Pick <b>ONE (0.5)</b> of: CS 2214 OR MATH 2155</li> \
            <li>Pick <b>2.0</b> of: ANY CS 3000 or higher level course, DATASCI 3000, SCIENCE 3377, MATH 2156, OR MATH 3159</li> \
            </ul>\
        "
    }
}

var courseCategories = {
    //"APPLMATH": "Applied Mathematics",
    "COMPSCI": "Computer Science",
    //"MATH": "Mathematics",
    //"CALCULUS": "Calculus",
    //"WRITING": "Writing"
}

var courseTags = {
    "MATH1600": ["Major", "Spec", "HonSpec"],

    // Computer Science
    "COMPSCI1025": ["Major", "Spec", "HonSpec"],
    "COMPSCI1026": ["Major", "Spec", "HonSpec"],
    "COMPSCI1027": ["Major", "Spec", "HonSpec"],
    "COMPSCI1033": ["Major", "Spec", "HonSpec"],
    "COMPSCI2208": ["Major", "Spec", "HonSpec"],
    "COMPSCI2209": ["Major", "Spec", "HonSpec"],
    "COMPSCI2210": ["Major", "Spec", "HonSpec"],
    "COMPSCI2211": ["Major", "Spec", "HonSpec"],
    "COMPSCI2212": ["Major", "Spec", "HonSpec"],
    "COMPSCI2214": ["Major", "Spec", "HonSpec"],
    "COMPSCI3305": ["Major", "Spec", "HonSpec"],
    "COMPSCI3307": ["Major", "Spec", "HonSpec"],
    "COMPSCI3346": ["Minor"],
    "COMPSCI3388": ["Minor"],
    "COMPSCI3374": ["Minor"],
    "COMPSCI4480": ["Minor"],
    "COMPSCI4482": ["Minor"],
    "COMPSCI4483": ["Minor"],
}

module.exports = {
    courseCategories,
    courseTags,
}