import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSChema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

}, {timestamps: true});

commentSChema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSChema);