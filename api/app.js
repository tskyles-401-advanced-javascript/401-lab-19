'use strict';

const app = require('./cfps-server');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Up on ${port}`);
});