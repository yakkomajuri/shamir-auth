const { split, join } = require('shamir');
const { randomBytes } = require('crypto');
const fs = require('fs-extra');
const CryptoJS = require('crypto-js');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('What would you like to do? (encrypt/decrypt): ', (answer) => {
    switch (answer) {
        case "encrypt":
            encrypt();
            break;
        case "decrypt":
            decrypt();
            break;
        default:
            console.log("Invalid command, exiting...");
            return;
    }
    rl.close();
});


const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();
const PARTS = 11;
const QUORUM = 6;
const secret = JSON.stringify({
    "header": {
        "valid": true
    },
    "data": "a lot of user data"
});


function encrypt() {
    var encryptedData = {};
    var username = process.env.SHAMIR_USERNAME;
    var password = process.env.SHAMIR_PASSWORD;
    const secretBytes = utf8Encoder.encode(secret);
    var parts = split(randomBytes, PARTS, QUORUM, secretBytes);
    usernameParts = [parts[1], "|||", parts[2]];
    passwordParts = [parts[3], "|||", parts[4], "|||", parts[5], "|||", parts[6]];
    console.log(typeof (parts))
    encryptedData["username"] = CryptoJS.AES.encrypt(usernameParts.join(), username).toString();
    encryptedData["password"] = CryptoJS.AES.encrypt(passwordParts.join(), password).toString();
    fs.writeFile("./data.json", JSON.stringify(encryptedData), function (err) {
        if (!err) {
            console.log("File written successfully.");
        }
    })
}


async function decrypt() {
    var username = process.env.SHAMIR_USERNAME;
    var password = process.env.SHAMIR_PASSWORD;
    var dataObj;
    try {
        dataObj = await fs.readJson('./data.json')
    } catch (err) {
        console.error(err);
        return;
    }
    var decryptedUsernameData = CryptoJS.AES.decrypt(dataObj["username"], username).toString(CryptoJS.enc.Utf8);
    var decryptedPasswordData = CryptoJS.AES.decrypt(dataObj["password"], password).toString(CryptoJS.enc.Utf8);
    var usernameParts = decryptedUsernameData.split(",|||,").map(splitArrays);
    var passwordParts = decryptedPasswordData.split(",|||,").map(splitArrays);
    var partsArr = usernameParts.concat(passwordParts);
    var parts = {};
    for (var i = 0; i < partsArr.length; i++) {
        parts[i + 1] = new Uint8Array(partsArr[i].map(Number));
    }
    var recovered = join(parts);
    var decoded = JSON.parse(String(utf8Decoder.decode(recovered)));
    console.log("Logged In: " + decoded.header.valid);
    console.log("\n" + decoded.data);
}


function splitArrays(str) {
    return str.split(",");
}

