import { Router } from 'express';
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.contoller.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

//Apply JWT verification middleware to all routes in this router
router.use(verifyJWT);

//for video comments
router.route("/video/:videoId").get(getVideoComments).post(addComment);
//for tweet comments
router.route("/tweet/:tweetId").post(addComment);
//for individual comment operations
router.route("/comment/:commentId").delete(deleteComment).patch(updateComment);

export default router;