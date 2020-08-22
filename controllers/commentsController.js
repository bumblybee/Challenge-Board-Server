const Question = require("../db").Question;
const User = require("../db").User;
const Comment = require("../db").Comment;

exports.deleteComment = async (req, res) => {
  await Comment.destroy({ where: { id: req.params.id } });
  res.json({ message: `Comment ${req.params.id} deleted` });
};
