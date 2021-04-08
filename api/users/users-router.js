const express = require('express');
const mw = require('../middleware/middleware');
const Users = require('./users-model');
const Post = require('../posts/posts-model');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/',  (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get(req)
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    console.error('err:', err)
  })
});

router.get('/:id', mw.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', mw.validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
  .then(newUser => {
    console.log('newUser:', newUser)
    res.status(200).json(newUser)
  })
  .catch(nothing => {
    console.error('nothing:', nothing)
  })
});

router.put('/:id', mw.validateUser, mw.validateUserId,(req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
  .then(numberOfUsersUpdated => {
    console.log('req.user:',req.user)
    // console.log('numberOfUsersUpdated:', numberOfUsersUpdated) = 1
    // res.status(200).json({id:req.params.id, ...req.body}) will
  })
  .then(async () =>{
    const updatedUser = await Users.getById(req.params.id)
    if(updatedUser){
    console.log('updatedUser',updatedUser)
    res.json(updatedUser)}
  })
  .catch(nothing => {
    console.error('nothing:', nothing)
  })
});


router.delete('/:id', mw.validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const deletedUser = await Users.remove(req.params.id)
  if(deletedUser){
    console.log(req.user)
    res.json(req.user)
  } else{
    res.status(400).json({message: 'Unable to find user to delete'})
  }

});

router.get('/:id/posts', mw.validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try{
    const result = await Users.getUserPosts(req.params.id)
    res.json(result)
  }
  catch (err) {
    next(err)
  }
 
});

router.post('/:id/posts', mw.validateUserId, mw.validatePost, async (req, res, next) => {
  
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try{
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
});

// do not forget to export the router


module.exports = router;