module.exports = function (io) {
  let socketlist = {}; // 人名
  let PeopleNum = 0; // 人数
  let user = [];
  io.on("connection", (socket) => {
    // 欢迎
    socket.on("Join", (name, img) => {
      socket.name = name; // 给 socket 添加一个 name 属性
      socketlist[name] = socket.id; // 把这个ID 赋值给每一个 name属性
      PeopleNum++;
      let userData = { name, img, id: socket.id, tip: false };
      user.push(userData);

      // broadcast 可以让别人看到
      socket.broadcast.emit("welcome", name, user); // 让别人看见我进来了
      socket.emit("myself", name, user, socket.id);
    });
    // 群聊 √
    socket.on("sendMsg", (data) => {
      // 让别人看见我发的消息
      socket.broadcast.emit("sendMsg", data);
    });
    // 返回离开
    socket.on("disconnecting", function () {
      if (socketlist.hasOwnProperty(socket.name)) {
        delete socketlist[socket.name];
        for (let index in user) {
          if (user[index].name === socket.name) {
            user.splice(index, 1);
          }
        }
        PeopleNum--;
        socket.broadcast.emit("quit", socket.name, user);
      }
    });
    // 一对一消息  √
    socket.on("msg", (data) => {
      // 要发送给谁
      socket.to(data.tid).emit("MGS", data);
    });
  });
};
