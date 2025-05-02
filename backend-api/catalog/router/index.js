const Router = require('express').Router;
const PostController = require('../controllers/post-controller');
const rightsMiddleware = require('../middlewares/rights-middleware')
const router = new Router();

router.post('/create-post',PostController.createPost);
router.get('/watch/:link',PostController.readPost);
router.delete('/delete-post/:link',rightsMiddleware,PostController.deletePost)
router.get('/posts-by-category/:category',PostController.filterPost)
router.get('/all-posts',PostController.getAllPosts)

module.exports = router;