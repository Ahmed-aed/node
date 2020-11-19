const http = require("http");
const {router}=require('./router')
const servers = http.createServer(router);
const port = 3000
servers.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
