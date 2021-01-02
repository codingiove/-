let operation = require("../mongodb/operation/operation");
module.exports = function (io) {
  let users = {}; //  socket 注册用户
  io.on("connection", (socket) => {
    // 进来
    socket.on("join", (id) => {
      users[id] = socket.id;
      socket.name = id;
      // broadcast
    });
    // 1 对 1 消息
    socket.on("Chat", (msg, user_ID, Fid) => {
      // 位置转换
      msg.types == 3 && (msg.message = JSON.stringify(msg.message));
      // 音频转换
      msg.types == 2 && (msg.Message = JSON.stringify(msg.Message));
      if (!msg.time) {
        msg.time = null;
      }
      let data = {
        user_ID: user_ID,
        Friends_ID: Fid,
        message: msg.message || msg.Message,
        time: msg.time,
      };
      operation.OneInformationTable(data, msg.types);
      // 发给这为好友
      if (users[Fid]) {
        socket.to(users[Fid]).emit("ReceiveChat", msg, user_ID, 0);
      }
      // 发送自己
      socket.emit("ReceiveChat", msg, Fid, 1);
    });
    // 离开
    socket.on("disconnecting", function () {
      if (users.hasOwnProperty(socket.name)) {
        delete users[socket.name];
      }
    });
  });
};
