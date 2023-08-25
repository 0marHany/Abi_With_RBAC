const RBAC = require("easy-rbac")
const { opt } = require("./polices/indix")
const rbac = RBAC.create(opt)

module.exports = rbac;