const express = require("express")
const router = express.Router()

"use strict"

router.get("/", (req, res) => {
  res.send("home")

})

router.get("/acs", (req, res) => {
  res.send("acs")
})

module.exports = router
