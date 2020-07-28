exports.getQuestions = (req, res) => {
  const thread = req.params.id;
  res.json([
    {
      user: {
        username: "Mark Hill",
      },
      createdAt: "07/16/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium tempora labore.",
      isAnswered: false,
      commentCount: 3,
      threadId: 1,
    },
    {
      user: {
        username: "Mark Hill",
      },
      createdAt: "07/16/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium tempora labore.",
      isAnswered: false,
      commentCount: 3,
      threadId: 1,
    },
    {
      user: {
        username: "Sara Jones",
      },
      createdAt: "07/15/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium dolorum tempora labore.",
      isAnswered: true,
      commentCount: 2,
      threadId: 2,
    },
    {
      user: {
        username: "Molly Brown",
      },
      createdAt: "07/14/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium dolorum tempora.",
      isAnswered: false,
      commentCount: 4,
      threadId: 3,
    },
    {
      user: {
        username: "Jon Smith",
      },
      createdAt: "07/14/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat neque laudantium dolorum tempora labore.",
      isAnswered: false,
      commentCount: 1,
      threadId: 4,
    },
    {
      user: {
        username: "Lucy Thompson",
      },
      createdAt: "07/13/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium dolorum tempora labore.",
      isAnswered: true,
      commentCount: 5,
      threadId: 5,
    },
    {
      user: {
        username: "Mark Hill",
      },
      createdAt: "07/12/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium dolorum tempora labore.",
      isAnswered: true,
      commentCount: 7,
      threadId: 6,
    },
  ]);
};
