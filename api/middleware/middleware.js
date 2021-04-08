const Users = require('../users/users-model');
// const Posts = require('../posts/posts-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  let date = new Date()
  let hours = date.getHours();
  let minutes = date.getMinutes();
  console.log('req method:', req.method, 'req url:', req.originalUrl, 'timestamp', `${hours}:${minutes}`)
  next();
}

const validateUserId = async (req, res, next) => {
  // DO YOUR MAGIC
  const {id} = req.params
  try{
    const user = await Users.getById(id)
    if(!user){
      res.status(404).json({ message: "user not found" })
    } else {
      req.user = user
      next();
    }

  }catch(e) {
    res.status(500).json(e.message)
  }
}

const validateUser = (req, res, next) => {
  // DO YOUR MAGIC
  const {name} = req.body;
  if(!name){
    res.status(400).json({ 
      message: "missing required name field" 
    })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const {text} = req.body;
  if(!text){
    res.status(400).json({ 
      message: "missing required text field" 
    })
  } else {
    req.text = text
    next()
  }
}

function errors(err, req,res,next){
  res.status(err.message || 500).json({
    message: err.message,
    stack: err.stack,
    custom: "Ya won't find what you're lookin for here."
  })
  
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUser,
  validateUserId,
  validatePost,
  errors
}