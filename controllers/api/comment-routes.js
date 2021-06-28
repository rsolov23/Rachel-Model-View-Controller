const router = require("express").Router();
const { Comment } = require("../../models"); // ??get all customElements
//find all comments with id to post id
router.get("/", (req, res) => {
  Comment.findAll()
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// post route to create new comment if logged in with authoruty
router.post("/", (req, res) => {
  // expects => {comment_text: "This is the comment", user_id: 1, post_id: 2}
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      user_id: req.session.user_id,
      post_id: req.body.post_id,
    })
      .then((dbCommentData) => res.json(dbCommentData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});
// put route to edit if logged infind commenet by ID
// find comment by id or title
router.put("/:id", (req, res) => {
  Comment.update(
    {
      title: req.body.title,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// delete route to destroy comments if logged in
//get comment by id to destroy
router.delete("/:id", (req, res) => {
  if (req.session) {
    Comment.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((dbCommentData) => {
        if (!dbCommentData) {
          res.status(404).json({ message: "No comment found with this id!" });
          return;
        }
        res.json(dbCommentData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});
module.exports = router;
