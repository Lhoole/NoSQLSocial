const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
    .populate({
      path: "reactions",
      select: "-__v",
    })
    .select('-__v')
      .then((thoughtObj) =>  res.json(thoughtObj))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
    .then(({ _id }) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: _id } },
        { new: true }
      );
    })
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((thoughtdata) => {
        if (!thoughtdata) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thoughtdata);
      })
      .catch((err) => res.json(err));
  },
  // Delete a thought and remove them from the user
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thoughtdata) =>{
        if (!thoughtdata){
          return res.status(404).json({ message: 'No such thought exists' })
      }
      return User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      )})
      .then(() =>{
        res.json({ message: 'Thought successfully deleted' })
  })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an friend to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body} },
      { runValidators: true, new: true }
    )
      .then((thoughtdata) =>
        !thoughtdata
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thoughtdata)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove reaction from a thought
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
