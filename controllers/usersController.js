exports.getUsers = (req, res) => {
  res.json([
    {
      id: 1,
      name: "Mark Hill",
      username: "hill34",
    },
    {
      id: 2,
      name: "Sam Jones",
      username: "pizza55",
    },
    {
      id: 3,
      name: "Molly Brown",
      username: "simplesimon",
    },
    {
      id: 4,
      name: "Sara London",
      username: "bigben",
    },
  ]);
};
