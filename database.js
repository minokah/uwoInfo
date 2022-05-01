var SimpleCrypto = require("simple-crypto-js").default
var encryption = new SimpleCrypto("a random key")

var sql = require('mysql2');
var db = sql.createConnection({
    host: "host ip",
    user: "username",
    password: "password",
    database: "uwoInfo"
})


/*

    Account Management

*/

async function verifyAccount(username, hash) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM uwoInfo.Users WHERE username="${username}"`, function (err, result) {
            try {
                if (err || result.length <= 0 || encryption.decrypt(result[0].password) != encryption.decrypt(hash.replace(/ /g, "+"))) return reject("Authentication failed")
                resolve()
            }
            catch {
                return reject("Authentication failed")
            }
        })
    })
}

async function existsAccount(username) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM uwoInfo.Users WHERE username="${username}"`, (err, result) => {
            if (err || result.length > 0) reject()
            else resolve()
        })
    })
}

async function createAccount(username, password, email) {
    return new Promise(async (resolve, reject) => {
        await existsAccount(username).catch(() => { return reject("Account already exists") })

        var encryptPass = encryption.encrypt(password)
        db.query(`INSERT INTO uwoInfo.Users (username, password, email) VALUES ("${username}", "${encryptPass}", "${email}")`, function (err) {
            if (err) return reject("Failed to create account for some reason")
            else resolve(encryptPass)
        })
    })
}

async function loginAccount(username, password) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM uwoInfo.Users WHERE username="${username}"`, function (err, result) {
            if (err || result.length <= 0 || encryption.decrypt(result[0].password) != password) return reject("Invalid username or password")
            resolve(result[0].password)
        })
    })
}

async function changePassword(username, hash, old, ne) {
    return new Promise(async (resolve, reject) => {
        await verifyAccount(username, hash).catch((err) => { return reject(err) })

        if (encryption.decrypt(hash.replace(/ /g, "+")) != old) return reject("Your old password is not correct")

        var encryptPass = encryption.encrypt(ne)
        db.query(`UPDATE uwoInfo.Users SET password="${encryptPass}" WHERE username="${username}"`, function (err) {
            if (err) return reject("Failed to change password")
            resolve(encryptPass)
        })
    })
}

async function deleteAccount(username, hash) {
    return new Promise(async (resolve, reject) => {
        await verifyAccount(username, hash).catch((err) => { console.log("bad"); return reject(err) })

        db.query(`DELETE FROM uwoInfo.Reviews WHERE username="${username}"`, function (err) {
            if (err) return reject("Failed to delete account")
            db.query(`DELETE FROM uwoInfo.Users WHERE username="${username}" AND password="${hash.replace(/ /g, "+")}"`, function (err) {
                if (err) return reject("Failed to delete account")
                resolve()
            })
        })
    })
}

/*

    Course and Review Queries

*/

async function getReviews(course) {
    return new Promise(async (resolve, reject) => {
        db.query(`SELECT * FROM uwoInfo.Reviews WHERE course="${course}"`, function (err, result) {
            if (err || result.length == 0) return reject("There are no entries for this course")
            resolve(result)
        })
    })
}

async function postReview(username, hash, course, liked, easy, useful, anonymous, description) {
    return new Promise(async (resolve, reject) => {
        await verifyAccount(username, hash).catch((err) => { return reject(err) })

        db.query(`INSERT INTO uwoInfo.Reviews (course, username, posted, liked, easy, useful, anonymous, description) VALUES ("${course}", "${username}", ${new Date().getTime()}, ${parseInt(liked)}, ${parseInt(easy)}, ${parseInt(useful)}, ${parseInt(anonymous)}, "${description.replace(/"/g, "'")}")`, function (err, result) {
            if (err) return reject("Failed to create review, for some reason")
            else resolve()
        })
    })
}

async function deleteReview(username, hash, course) {
    return new Promise(async (resolve, reject) => {
        await verifyAccount(username, hash).catch((err) => { return reject(err) })

        db.query(`DELETE FROM uwoInfo.Reviews WHERE course="${course}" AND username="${username}`, function (err, result) {
            if (err) return reject("Failed to remove, for some reason")
            else resolve()
        })
    })
}

module.exports = {
    existsAccount, createAccount, loginAccount, deleteAccount, changePassword, getReviews, postReview, deleteReview
}