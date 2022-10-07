const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

//verb all leaders
.get((req,res,next) => {
    res.end('Will send all leaders to you!');
})
.post((req, res, next) => {
    res.end('Will add  a leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all leaders');
});

//verb all leader with Id
leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send the leader with Id {0} to you!: '.replace('{0}',req.params.leaderId));
})
.post((req, res, next) => {
    res.end('Will update the leader with Id {0} to you!: '.replace('{0}',req.params.leaderId));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders/leaderId');
})
.delete((req, res, next) => {
    res.end('Deleting leader with Id ' + req.params.leaderId);
});

module.exports = leaderRouter;