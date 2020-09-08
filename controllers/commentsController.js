const { CustomError } = require("../handlers/errorHandlers");

const Question = require("../db").Question;
const User = require("../db").User;
const Comment = require("../db").Comment;

exports.createComment = async (req, res) => {
  const { body } = req.body;
  const { id: questionId } = req.params;
  const { id: userId } = req.token.data;
  const comment = { body, questionId, userId, isAnswer: false };

  const createdComment = await Comment.create(comment);

  if (createdComment) {
    res.json(createdComment);
  } else {
    throw new CustomError("post.failed", "CommentError", 500);
  }
};

exports.editComment = async (req, res) => {
  const id = req.token.data.id;
  const { body, userId } = req.body;

  if (id === userId) {
    const updatedComment = await Comment.update(
      { body: body },
      { where: { id: req.params.id } }
    );

    if (updatedComment) {
      res.status(201).json(updatedComment);
    } else {
      throw new CustomError("post.failed", "CommentError", 500);
    }
  }
};

exports.deleteComment = async (req, res) => {
  const deletedComment = await Comment.destroy({
    where: { id: req.params.id },
  });

  if (deletedComment) {
    res.json({ message: `Comment ${req.params.id} deleted`, deletedComment });
  } else {
    throw new CustomError("delete.failed", "CommentError", 500);
  }
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

  if (answer && answeredQuestion) {
    res.status(201).json({ message: `updated:`, answer, answeredQuestion });
  } else {
    throw new CustomError("post.failed", "QuestionError", 500);
  }
};
