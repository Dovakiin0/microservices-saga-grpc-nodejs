const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

require("./router")(app);

app.listen(PORT, () => {
  console.log("[EXPRESS] running on 3000");
});
