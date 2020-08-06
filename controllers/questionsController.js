const Question = require("../models/db").Question;

//TODO: set up route for thread id
exports.getQuestions = async (req, res) => {
  //Find all questions and sort by newest
  const questions = await Question.findAll({ order: [["createdAt", "DESC"]] });
  // const thread = req.params.id;
  res.json(questions);
};

exports.createQuestion = async (req, res) => {
  try {
    const {
      username,
      question,
      questionDetails,
      isAnswered,
      commentCount,
    } = req.body;
    const newQuestion = {
      username,
      question,
      questionDetails,
      isAnswered,
      commentCount,
    };
    await Question.create(newQuestion);
    res.json(newQuestion);
  } catch (error) {
    console.log(error);
  }
};

//TODO: Set isAnswered default to false and commentCount 0
