exports.getComments = async (req, res) => {
  res.json([
    {
      username: "Sam Hill",
      comment: "Very frustrating!",
      chosenAnswer: false,
      createdAt: "2020-08-10T10:07:47.988-05",
    },
    {
      username: "Molly Brown",
      comment: "I think the same thing, funny.",
      chosenAnswer: false,
      createdAt: "2020-08-10T14:09:47.988-05",
    },
    {
      username: "Mark Jones",
      comment: "Grab the input value with event.target and store it in state.",
      chosenAnswer: true,
      createdAt: "2020-08-09T14:07:47.988-05",
    },
  ]);
};
