const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Post silindiğinde o posta ait tüm yorumların da silinmesi için (Middleware)
postSchema.pre("findOneAndDelete", async function (next) {
  const docToDel = await this.model.findOne(this.getQuery());
  if (docToDel) {
    await mongoose.model("Comment").deleteMany({ post: docToDel._id });
  }
  next();
});

// Sanal Alan: Postun yorumlarını çekmek istersen kullanabilirsin
postSchema.virtual("postComments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

module.exports = mongoose.model("Post", postSchema);
