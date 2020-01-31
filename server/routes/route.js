const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const voteController = require('../controllers/voteController');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.getUser);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.get('/vote/:voteId', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'vote'), voteController.getVotes);

router.get('/votes', userController.allowIfLoggedin, userController.grantAccess('readAny', 'vote'), voteController.getVotes);

router.put('/vote/:voteId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'vote'), voteController.updateVote);

router.delete('/vote/:voteId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'vote'), voteController.deleteVote);

router.post('/vote', userController.allowIfLoggedin, voteController.vote);

router.get('/statistics', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'statistics'), voteController.statistic);

module.exports = router;