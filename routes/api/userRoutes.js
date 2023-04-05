const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  addFriend,
  removeFriend,
  updateUser,
} = require('../../controllers/userController');


router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;
