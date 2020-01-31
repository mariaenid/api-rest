const Vote = require('../models/voteModel');
const User = require('../models/userModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { roles } = require('../roles')

exports.getVotes = async (req, res, next) => {
    const votes = await Vote.find({});
    res.status(200).json({
      data: votes
    });
  }

  exports.getVote = async (req, res, next) => {
    try {
      const voteId = req.params.voteId;
      const vote = await Vote.findById(voteId);
      if (!vote) return next(new Error('Vote does not exist'));
      res.status(200).json({
        data: vote
      });
    } catch (error) {
      next(error)
    }
  }

  exports.updateVote = async (req, res, next) => {
    try {
      const { role } = req.body
      const voteId = req.params.voteId;
      await Vote.findByIdAndUpdate(voteId, { role });
      const vote = await User.findById(voteId)
      res.status(200).json({
        data: vote
      });
    } catch (error) {
      next(error)
    }
  }

  exports.deleteVote = async (req, res, next) => {
    try {
      const voteId = req.params.voteId;
      await Vote.findByIdAndDelete(voteId);
      res.status(200).json({
        data: null,
        message: 'User has been deleted'
      });
    } catch (error) {
      next(error)
    }
  }

  exports.vote = async (req, res, next) => {
    // TODO: agregar restriccion dates
      try {
        const today = new Date()
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getUTCMonth()+1, 1);

        const { voteUser, votedUser, area } = req.query;
        if(voteUser === votedUser) {
          return next(new Error ("not allowed vote yourself"));
        }
        const voteUserQuery = await User.findOne({email: voteUser}); // esto es un email
        console.log('voteUSer', voteUserQuery);

        if(!voteUserQuery) {
            return next(new Error ("User doesn't exist"));
        }
        console.log('voteUSer', voteUserQuery);
        const votedUserQuery = await User.findOne({email: votedUser}); // esto es un email
        if(!votedUserQuery) {
            return next(new Error ("User doesn't exist"));
        }

        // restrict votes by current month
        const votes = await Vote.find({ area, updated: { $gte: firstDay, $lt: lastDay } }).sort({ updated: 'asc'});

        console.log('Votoss', votes, voteUserQuery, voteUserQuery);
        const results = votes.filter(vote => vote.voteUserId === (voteUserQuery._id).toString());
        console.log('resultados', results);
        if(results && results.length > 0) {
            return next(new Error ("Already vote"));
        }

        const newVote = new Vote({ voteUserId: voteUserQuery._id, votedUserId: votedUserQuery._id, date: new Date(), area });
        await newVote.save();

        res.json({
            data: newVote,
            message: "You voted successfully"
          })

      } catch(error) {
          next(error)
      }
  }

  exports.statistic = async(req, res, next) => {
    // TODO: agregar estadisticas
    const { month, year } = req.query;

    const firstDay = new Date(parseInt(year), parseInt(month), 1);
    const lastDay = new Date(parseInt(year), parseInt(month)+1, 1);

    const votes = await Vote.count({ votedUserId, updated: { $gte: firstDay, $lt: lastDay } });
    console.log(votes);


  }