const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("employee") // be employee
    .readOwn("profile")
    .updateOwn("profile")
    .readOwn("vote")
    .updateOwn("vote")

  ac.grant("admin")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .readAny("vote")
    .updateAny("vote")
    .deleteAny("vote")
  return ac;
})();
