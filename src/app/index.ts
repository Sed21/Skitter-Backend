import express from 'express';

const server: express.Application = express();

server.listen(8080, () => {
  console.log("Server is listing")
})