const Vote = require("../models/voteModel");
const User = require("../models/userModel");

exports.getVotes = async (req, res, next) => {
  const votes = await Vote.find({});
  res.status(200).json({
    data: votes
  });
};

exports.getVote = async (req, res, next) => {
  try {
    const voteId = req.params.voteId;
    const vote = await Vote.findById(voteId);
    if (!vote) return next(new Error("Vote does not exist"));
    res.status(200).json({
      data: vote
    });
  } catch (error) {
    next(error);
  }
};

exports.updateVote = async (req, res, next) => {
  try {
    const { role } = req.body;
    const voteId = req.params.voteId;
    await Vote.findByIdAndUpdate(voteId, { role });
    const vote = await User.findById(voteId);
    res.status(200).json({
      data: vote
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVote = async (req, res, next) => {
  try {
    const voteId = req.params.voteId;
    await Vote.findByIdAndDelete(voteId);
    res.status(200).json({
      data: null,
      message: "User has been deleted"
    });
  } catch (error) {
    next(error);
  }
};

exports.vote = async (req, res, next) => {
  // TODO: agregar restriccion dates
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getUTCMonth() + 1, 1);

    const { voteUser, votedUser, area } = req.query;
    if (voteUser === votedUser) {
      return next(new Error("not allowed vote yourself"));
    }
    const voteUserQuery = await User.findOne({ email: voteUser }); // esto es un email

    if (!voteUserQuery) {
      return next(new Error("User doesn't exist"));
    }

    const votedUserQuery = await User.findOne({ email: votedUser }); // esto es un email
    if (!votedUserQuery) {
      return next(new Error("User doesn't exist"));
    }

    // restrict votes by current month
    const votes = await Vote.find({
      area,
      updated: { $gte: firstDay, $lt: lastDay }
    }).sort({ updated: "asc" });

    const results = votes.filter(
      vote => vote.voteUserId === voteUserQuery._id.toString()
    );
    if (results && results.length > 0) {
      return next(new Error("Already vote"));
    }

    const newVote = new Vote({
      voteUserId: voteUserQuery._id,
      votedUserId: votedUserQuery._id,
      date: new Date(),
      area
    });
    await newVote.save();

    res.json({
      data: newVote,
      message: "You voted successfully"
    });
  } catch (error) {
    next(error);
  }
};

exports.statistic = async (req, res, next) => {
  // TODO: agregar estadisticas
  try {
    const { month, year } = req.query;
    const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
    const lastDay = new Date(parseInt(year), parseInt(month) + 1, 1);

    const votes = await Vote.find({
      updated: { $gte: firstDay, $lt: lastDay }
    });
    const areas = [
      "teamPlayer",
      "technicalReferent",
      "keyPlayer",
      "clientSatisfaction",
      "motivation",
      "fun"
    ];

    const mostVotedByAreas = await Promise.all(
      areas.map(async area => {
        const votedByArea = votes.filter(vote => vote.area === area);

        const votedByAreaByUser = getVotedUsersList(votedByArea);
        const votedByAreaByUserOrderByValue = Object.keys(
          votedByAreaByUser
        ).sort((a, b) => votedByAreaByUser[a] - votedByAreaByUser[b]);

        let votedUsersByArea = [];
        // for is the best for promise async
        for (let i = 0; i < votedByAreaByUserOrderByValue.length; i++) {
          const userId = votedByAreaByUserOrderByValue[i];
          const user = await User.findById(userId);
          votedUsersByArea.push({
            total: votedByAreaByUser[userId],
            email: user.email,
            userId
          });
        }

        return { [area]: votedUsersByArea || [] };
      })
    );

    const mostVoted = getVotedUsersList(votes);
    let mostVotedOrdered = Object.keys(mostVoted).sort(
      (a, b) => mostVoted[a] - mostVoted[b]
    );
    let mostUsersVoted = [];
    for (let i = 0; i < mostVotedOrdered.length; i++) {
      const userId = mostVotedOrdered[i];
      const user = await User.findById(userId);
      mostUsersVoted.push({
        total: mostVoted[userId],
        email: user.email,
        userId
      });
    }

    res.json({
      totalUsersVoted: await Vote.find({
        updated: { $gte: firstDay, $lt: lastDay }
      }).countDocuments(),
      totalUsers: await User.countDocuments(),
      mostVotedByAreas,
      mostUsersVoted
    });
  } catch (error) {
    next(error);
  }
};

const getVotedUsersList = votes =>
  votes.reduce((acc, vote) => {
    const userId = vote.votedUserId;
    const votes = acc[userId] || 0;
    acc[userId] = votes + 1; //si  es su primera contabilizacion o no
    return acc;
  }, {});
