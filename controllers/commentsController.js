const Question = require("../db").Question;
const User = require("../db").User;
const Comment = require("../db").Comment;

exports.createComment = async (req, res) => {
  try {
    const { body } = req.body;
    const { id: questionId } = req.params;
    const { id: userId } = req.token.data;
    const comment = { body, questionId, userId, isAnswer: false };

    const createdComment = await Comment.create(comment);
    res.json(createdComment);
  } catch (err) {
    console.log(err);
  }
};

exports.editComment = async (req, res) => {
  //TODO: handle error
  const id = req.token.data.id;
  const { body, userId } = req.body;

  if (id === userId) {
    const updatedComment = Comment.update(
      { body: body },
      { where: { id: req.params.id } }
    );
    res.status(201).json(updatedComment);
  }
};

exports.deleteComment = async (req, res) => {
  await Comment.destroy({ where: { id: req.params.id } });
  res.json({ message: `Comment ${req.params.id} deleted` });
};
