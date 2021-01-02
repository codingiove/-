let operation = require("../mongodb/operation/operation"); // 操作数据库
module.exports = function (app) {
  // 注册
  app.post("/signin", (req, res) => {
    let { name, psw, email } = req.body;
    operation.NewUser(name, psw, email, res);
  });
  // 登录
  app.post("/LogIn", (req, res) => {
    let { data, psw } = req.body;
    operation.LogIn(data, psw, res);
  });
  // 搜索用户
  app.post("/Search/User", (req, res) => {
    let { data } = req.body;
    operation.Search(data, res);
  });
  // 用户详细信息
  app.post("/User/Details", (req, res) => {
    let { _id } = req.body;
    operation.UserDetails(_id, res);
  });
  // 用户信息修改
  app.post("/User/Information/Modify", (req, res) => {
    operation.UserInformationModify(req.body, res);
  });
  // 判断是否为好友
  app.post("/Friend", (req, res) => {
    let { Id, Fid } = req.body;
    operation.Friend(Id, Fid, res);
  });
  // 好友申请
  app.post("/Friend/Request", (req, res) => {
    operation.FriendRequest(req.body, res);
  });
  // 添加好友的内容
  app.post("/leave", (req, res) => operation.leave(req.body, res));
  // 同意好友
  app.post("/Agree/With/Buddy", (req, res) => {
    operation.AgreeWithBuddy(req.body, res);
  });
  // 拒绝或删除好友
  app.post("/Delete/Friend", (req, res) => {
    operation.DeleteFriend(req.body, res);
  });
  // 首页
  app.post("/Home/Page/Data", (req, res) => {
    operation.HomePageData(req.body, res);
  });
  // 一对一信息表
  app.post("/Information/Table", (req, res) => {
    operation.InformationTable(req.body, res);
  });
  // 消息未读数
  app.post("/Message/Not/Read", (req, res) => {
    operation.MessageNotRead(req.body, res);
  });
  // 消息已读
  app.post("/Message/Read", (req, res) => {
    operation.MessageRead(req.body, res);
  });
  // 分页数据
  app.post("/Paging/Data", (req, res) => {
    operation.PagingData(req.body, res);
  });
  // 创群
  app.post("/Create/A/Group", (req, res) => {
    operation.CreateAGroup(req.body, res);
  });
  // 获取群
  app.post("/Get/Group/List", (req, res) => {
    operation.GetGroupList(req.body, res);
  });
  // 群成员
  app.post("/Cluster/Member", (req, res) => {
    operation.ClusterMember(req.body, res);
  });
};
