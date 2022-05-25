const { User, Thought } = require('../models'); 

const userController = {

    // GET all users 

    getAllUsers(req, res) {
        User.find()
          .select('-__v')
          .then((dbUserData) => {
            res.json(dbUserData);
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json(err);
          });
      },

      // GET single user by ID 

      getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate('friends')
        .populate('thoughts')
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'Sorry! No user found with this ID'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    
    // Create a new user 
    createUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => {
            res.json(dbUserData)); 

        .catch((err) => res.status(500).json(err)); 
     }, 

     // Update a user 
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
        .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "Sorry! No user found with this ID" });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.status(500).json(err));
      },
    
     // Add friend 
     addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found at this id!' });
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },



};