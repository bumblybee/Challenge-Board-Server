const { CustomError } = require("../handlers/errorHandlers");

const Question = require("../db").Question;
const Comment = require("../db").Comment;

exports.createComment = async (req, res) => {
  const { body } = req.body;
  const { id: questionId } = req.params;
  const { id: userId } = req.token.data;
  const comment = { body, questionId, userId, isAnswer: false };

  const createdComment = await Comment.create(comment);

  res.status(200).json(createdComment);
};

exports.editComment = async (req, res) => {
  const id = req.token.data.id;
  const { body, userId } = req.body;

  if (id === userId) {
    const updatedComment = await Comment.update(
      { body: body },
      { where: { id: req.params.id } }
    );

    res.status(201).json(updatedComment);
  }
};

exports.deleteComment = async (req, res) => {
  const deletedComment = await Comment.destroy({
    where: { id: req.params.id },
  });

  res
    .status(200)
    .json({ message: `Comment ${req.params.id} deleted`, deletedComment });
};

exports.selectAnswer = async (req, res) => {
  const { commentId, questionId } = req.params;

  const answer = await Comment.update(
    { isAnswer: true },
    { where: { id: commentId } }
  );
  const answeredQuestion = await Question.update(
    { isAnswered: true },
    { where: { id: questionId } }
  );

  res.status(201).json({ message: `updated:`, answer, answeredQuestion });
};
