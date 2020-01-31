# LAB - 19

## Message Queue Server

### Author: Travis Skyles

### Links and Resources
* [submission PR](https://github.com/tskyles-401-advanced-javascript/401-lab-19/pull/1)
* [travis](https://travis-ci.com/tskyles-401-advanced-javascript/401-lab-19)

### Setup
#### How to initialize/run your server app (where applicable)
* `node` /api/app.js
* `node` /queue-server/queue-server.js
* `node` /clients/acme-widgets.js
* `node` /clients/flower-shop.js
* To send messages post to:
  * `/delivery/:retailer/:code`
  
#### Tests
* Unit Tests: `npm test`
* Lint Tests: `npm run lint`

#### UML
![UML](assets/lab19.jpg)