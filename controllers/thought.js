// const { Thought } = require("../models/Thought");
// const User = require("../models/User");
   
const { User, Thought, Reaction } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  // Fetch a thought by ID

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.getThoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Sorry! No thought found with this ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  // Create a new thought
  newThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(500).json({ message: 'Sorry! No user with this id' });
        }

        res.json({ message: 'Congrats! Your thought has been created successfully!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Update a thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { runValidators: true, new: true
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(500).json({ message: "Sorry! No thought found with this ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((error) => res.status(400).json(error));
  },

  // Delete a thought 
  deleteThought({ params }, res) {
    // delete the thought
    Thought.findOneAndDelete({ _id: params.id })
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'Sorry! No thought found with this ID'});
            return;
        }
        // delete the reference to deleted thought in user's thought array
        User.findOneAndUpdate(
            { username: dbThoughtData.username },
            { $pull: { thoughts: params.id } }
        )
        .then(() => {
            res.json({message: 'Successfully deleted the thought'});
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
},

// Add a reaction 
addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({ message: 'Sorry! No thought found with this ID' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(500).json(err));
},

// Delete a reaction 
deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'Sorry! No thought found with this ID' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
}; 

modeule.exports = thoughtController; 
