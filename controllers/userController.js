const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find({})
      .select("-__v")
      .then(userdata =>  res.json(userdata))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },


  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      // .populate({
      //   path: "thoughts",
      //   select: "-__v",
      // })
      // .populate({
      //   path: "friends",
      //   select: "-__v",
      // })
      .select('-__v')
      .then((userdata) =>
        !userdata
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(userdata)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((userdata) => res.json(userdata))
      .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.id })
      .then((userdata) =>{
        if (!userdata){
          return res.status(404).json({ message: 'No such user exists' })}
      return Thought.deleteMany({ _id: { $in: userdata.thoughts } })
      })
      .then(() =>{
        res.json({ message: 'User successfully deleted' })
  })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((userdata) => {
        if (!userdata) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(userdata);
      })
      .catch((err) => res.json(err));
  },
  // Add an friend to a user
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove friend from a user
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
