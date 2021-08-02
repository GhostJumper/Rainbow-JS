const md5_func = require("blueimp-md5")
const hash = require('hash.js')

const known_algorithms = {
    md5, sha1, sha256, sha512
}

function md5(input) {
    return md5_func(input)
}

function sha1(input) {
    return hash.sha1().update(input).digest("hex")
}

function sha256(input) {
    return hash.sha256().update(input).digest("hex")
}

function sha512(input) {
    return hash.sha512().update(input).digest("hex")
}

function hashAll(plain_text) {

    let result = {plain_text: plain_text}

    for (const [algorithm, hashing_function] of Object.entries(known_algorithms)) {
        result[algorithm] = hashing_function(plain_text)
    }

    return result
}

//Filters all hash results by n algorithms
function filterAlgorithms(hashes, algorithms) {
    if (algorithms.length === 0) return hashes
    let result = {"plain_text": hashes.plain_text}
    algorithms.forEach(algorithm => {
        if (typeof hashes[algorithm] === "undefined") {
            result[algorithm] = null
        } else result[algorithm] = hashes[algorithm]
    })

    return result

}

module.exports = {hashAll, filterAlgorithms, known_algorithms}