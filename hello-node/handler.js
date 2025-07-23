"use strict"

module.exports = async (event, context) => {
  const name = event.body || "Mehmet"
  return context
    .status(200)
    .headers({ "Content-Type": "text/plain" })
    .succeed(`Hello, ${name} from Node.js + OpenFaaS`)
}
