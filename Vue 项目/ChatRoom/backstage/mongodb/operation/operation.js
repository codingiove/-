// 操作数据库
let bcrypt = require("../../plugIn/pswEncrypt"); // 引入加密文件
let dbmodel = require("../db"); // 导入所有表 (Model { Group_news }) 打印的是最后一张表
let User = dbmodel.model("User"); // 用户 , 从你导出的表,再导入用户表
let Friends = dbmodel.model("Friends"); // 好友
let Friends_chat = dbmodel.model("Friends_chat"); // 好友聊天
let group = dbmodel.model("group"); // 群
let cluster = dbmodel.model("cluster"); // 群成员
let Group_news = dbmodel.model("Group_news"); // 群消息
let Friend_request = dbmodel.model("Friend_request"); // 好友申请
let token = require("../../plugIn/token"); // token
// code 0 代表有问题
let total = 0; // 总聊天数
function GlobalErr(name, res) {
  return res.send(`${name}  服务器忙,请稍后....`);
}

// 修改方法
function Update(id, rule, res) {
  // 查询条件 / 修改规则(传一个对象)
  return User.findByIdAndUpdate(id, rule, (err, UpValue) => {
    err && res.status(500).send("服务器忙,请稍后....");
    res.status(200).send({ status: 200, rule });
  });
}

// 注册 ✔
exports.NewUser = function (name, psw, email, res) {
  // 密码加密
  psw = bcrypt.Encrypt(psw);
  // 要添加到数据库的数据
  let DATA = {
    name,
    psw,
    email,
    time: new Date(),
  };
  User.findOne({ email }, (err, data) => {
    err && GlobalErr("NewUser", res);
    // 判断该邮箱是否存在
    if (data) {
      return res.status(200).send({ code: 0, success: "邮箱已被注册" });
    } else {
      // 添加到数据库
      return new User(DATA).save((err) => {
        err
          ? res.status(500).send("注册失败")
          : res.status(200).send({ code: 1 });
      });
    }
  });
};

// 登录 ✔
exports.LogIn = function (data, psw, res) {
  // 解密
  psw = bcrypt.decode(psw);
  // 用户或邮箱
  User.findOne(
    {
      $or: [{ name: data }, { email: data }],
    },
    (err, value) => {
      err && GlobalErr("LogIn", res);
      // 如果没有用户或者邮箱
      !value && res.status(200).send({ code: 0, success: "邮箱或者用户有误" });
      // 有当前用户用户或者邮箱
      if (value) {
        // 判断密码是否一样
        if (psw === value.psw) {
          let instructions = token.GenerateToken(value.id);
          let back = {
            id: value.id,
            name: value.name,
            img: value.user_img,
            token: instructions,
          };
          return res.status(200).send({ code: 1, back });
        } else {
          return res.status(200).send({ code: 0, success: "密码有误" });
        }
      }
    }
  );
};

// 用户搜索  ✔
exports.Search = function (data, res) {
  // $regex 只要包含某个的字全部搜索出来
  let rule = {
    $or: [{ name: { $regex: data } }, { email: { $regex: data } }],
  };
  // 只显示 name,email,user_img  (1显示 0不显示)
  let ShowOnly = { name: 1, email: 1, user_img: 1 };
  User.find(rule, ShowOnly, (err, value) => {
    err && GlobalErr("Search", res);
    // 没有找到返回的是空数组
    value && res.status(200).send(value);
    //  res.status(500).send({ code: 0, success: "没有当前用户" });
  });
};

// 判断是否为好友 ✔
exports.Friend = function (Id, Fid, res) {
  let rule = { user_ID: Id, Friends_ID: Fid, state: "0" };
  Friends.findOne(rule, (err, value) => {
    err && GlobalErr("Friend", res);
    value
      ? res.status(200).send({ status: 200, success: "已是好友" }) // 是好友
      : res.status(200).send({ status: 400, success: "你们还不是好友" }); // 不是好友
  });
};

// 用户详细信息 ✔
exports.UserDetails = function (_id, res) {
  User.findOne({ _id }, (err, value) => {
    err && GlobalErr("UserDetails", res);
    res.status(200).send(value);
  });
};

// 用户信息修改 ✔
exports.UserInformationModify = function (Obj_Data, res) {
  let User_PSW = "";
  User_PSW = Obj_Data.rule.psw;
  if (Obj_Data.psw) {
    User.find({ _id: Obj_Data.id }, { psw: Obj_Data.psw }, (err, value) => {
      err && GlobalErr("UserInformationModify", res);
      if (!value) {
        res.status(200).send({ code: 0, success: "当前用户不存在" });
      } else {
        // 如果是修改的密码,对他进行加密
        Obj_Data.rule.psw &&
          (Obj_Data.rule.psw = bcrypt.Encrypt(Obj_Data.rule.psw));
        // 如果是修改用户名或邮箱
        if (Obj_Data.rule.name || Obj_Data.rule.email) {
          // 看看 User 有没有重复的用户名或邮箱 0 表示没有
          User.countDocuments(Obj_Data.rule, (err, result) => {
            err && GlobalErr("UserInformationModify", res);
            return result === 0
              ? Update(Obj_Data.id, Obj_Data.rule, res)
              : res.send({ code: 0, success: "该邮箱或名称已存在,换一个吧!" });
          });
        } else {
          // 返回给前端不加密的密码
          Obj_Data.rule.User_PSW = User_PSW;
          return Update(Obj_Data.id, Obj_Data.rule, res);
        }
      }
    });
  } else {
    res.status(200).send({ code: 0, success: "请输入密码" });
  }
};

// 添加好友 ✔
exports.AddFriend = function (user_ID, Friends_ID, state) {
  let data = {
    user_ID,
    Friends_ID,
    state,
    time: new Date(),
  };
  new Friends(data).save((err) => err && GlobalErr("AddFriend", res));
};

// 添加一对一信息表 ✔
exports.OneInformationTable = async function (Obj_Data, types) {
  let { user_ID, Friends_ID, message, time } = Obj_Data;
  let data = {
    user_ID,
    Friends_ID,
    types,
    message,
    time,
    state: 1, // 1未读
  };
  await new Friends_chat(data).save();
  let rule = {
    $or: [
      { user_ID: user_ID, Friends_ID: Friends_ID },
      { user_ID: Friends_ID, Friends_ID: user_ID },
    ],
  };
  // 更新聊天时间
  await Friends.updateMany(
    rule,
    { time: new Date() },
    (err) => err && GlobalErr("更新时间失败", err)
  );
};

// 好友申请 ✔
exports.FriendRequest = async function (Obj_Data, res) {
  let { user_ID, Friends_ID, message } = Obj_Data;
  let rule = { user_ID, Friends_ID };
  // 查找拒绝的好友或删除
  await Friends.find(rule, { state: 3 }, (err, state) => {
    if (state.length >= 1) {
      let rule2 = { user_ID: user_ID, Friends_ID: Friends_ID };
      let rule1 = { user_ID: Friends_ID, Friends_ID: user_ID };
      Friends.updateOne(
        rule2,
        { state: 2 },
        (err) => err && GlobalErr("重新添加好友", res)
      );
      Friends.updateOne(
        rule1,
        { state: 1 },
        (err) => err && GlobalErr("重新添加好友", res)
      );
    }
  });
  // 好友申请
  await Friends.countDocuments(rule, (err, value) => {
    err && GlobalErr("Friends", err);
    // 没有申请好友
    if (value === 0) {
      // ( 1别人添加我 , 2我添加别人 )
      // 建立好友关系
      this.AddFriend(user_ID, Friends_ID, 2);
      this.AddFriend(Friends_ID, user_ID, 1);
      res.send({ status: 200 });
    } else {
      // 重新申请好友
      let AnewRule = {
        $or: [
          { user_ID: user_ID, Friends_ID: Friends_ID },
          { user_ID: Friends_ID, Friends_ID: user_ID },
        ],
      };
      Friends.updateMany(
        AnewRule,
        { time: new Date() },
        (err) => err && GlobalErr("FriendsUpdateOne", err)
      );
      res.send({ status: 200, msg: "更新了" });
    }
    // 添加好友的内容
    new Friend_request({
      user_ID,
      Friends_ID,
      message,
      time: new Date(),
    }).save();
  });
};
// 添加好友的内容
exports.leave = function ({ Friends_ID }, res) {
  Friend_request.find({ user_ID: Friends_ID }, (err, value) =>
    res.send({ value })
  );
};
// 同意好友 ✔
exports.AgreeWithBuddy = function (Obj_Data, res) {
  const { user_ID, Friends_ID } = Obj_Data;
  let rule = {
    $or: [
      { user_ID: user_ID, Friends_ID: Friends_ID },
      { user_ID: Friends_ID, Friends_ID: user_ID },
    ],
  };
  Friends.updateMany(rule, { state: 0 }, (err) => {
    err && GlobalErr("AgreeWithBuddy", err);
    res.send({ status: 200, success: "确认好友" });
  });
};
// 删除好友 ✔
exports.DeleteFriend = function ({ user_ID, Friends_ID }, res) {
  let rule = {
    $or: [
      { user_ID: user_ID, Friends_ID: Friends_ID },
      { user_ID: Friends_ID, Friends_ID: user_ID },
    ],
  };
  Friends.updateMany(rule, { state: 3 }, (err, value) => {
    err && GlobalErr("DeleteFriend", err);
    res.send({ status: 200, success: "删除好友", value });
  });
};
// 首页数据 ✔
exports.HomePageData = function (Obj_Data, res) {
  let { user_ID, state } = Obj_Data;
  Friends.find({}, (err, value) => {
    err && GlobalErr("HomePageData", err);
    let data = value.map((item) => {
      return {
        id: item.Friends_ID._id,
        name: item.Friends_ID.name,
        img: item.Friends_ID.user_img,
        time: item.time,
      };
    });
    res.send(data);
  })
    .where({ user_ID, state }) // 返回满足条件的数据
    .populate("Friends_ID") // 约束中有 ref 就可以获取(你关联的表的数据)
    .sort({ time: -1 }); //   -1 从大到小排
};

// 一对一信息表 ✔
exports.InformationTable = function (Obj_Data, res) {
  let { user_ID, Friends_ID } = Obj_Data;
  // 查询条件
  let criteria = {
    $or: [
      { user_ID: user_ID, Friends_ID: Friends_ID },
      { user_ID: Friends_ID, Friends_ID: user_ID },
    ],
  };
  Friends_chat.find({}, (err, value) => {
    err && GlobalErr("InformationTable", err);
    let data = value.map((item) => {
      return {
        message: item.message,
        time: item.time,
        types: item.types,
      };
    });
    res.send(data);
  })
    .where(criteria)
    .sort({ _id: -1 }); // 返回最后一条消息
};

// 消息未读数 ✔
exports.MessageNotRead = function (Obj_Data, res) {
  let { user_ID, Friends_ID } = Obj_Data;
  // 查看好友给我发的消息
  let rule = { user_ID: Friends_ID, Friends_ID: user_ID, state: "1" };
  Friends_chat.countDocuments(rule, (err, value) => {
    err && GlobalErr("MessageNotRead", err);
    res.send({ result: value });
  });
};

// 消息已读 ✔
exports.MessageRead = function ({ user_ID, Friends_ID }, res) {
  let rule = { user_ID: Friends_ID, Friends_ID: user_ID };
  Friends_chat.updateMany(rule, { state: "0" }, (err, value) => {
    err && GlobalErr("MessageRead", err);
    res.send({ status: 200 });
  });
};

// 创建群 ✔
exports.CreateAGroup = async function (Obj_Data, res) {
  try {
    let { user_ID, group_name, group_img, member_arr } = Obj_Data;
    return await new Promise((resolve, reject) => {
      let GroupData = {
        user_ID, // 创建人 ID
        group_name, // 群名
        group_img, // 群头像
        time: new Date(), // 创建群的时间
      };
      // 创群
      new group(GroupData).save((err, result) => {
        err && reject(GlobalErr("创群失败", err));
        resolve(result);
      });
    }).then(
      async (value) => {
        for (const i in member_arr) {
          let data = {
            group_ID: value._id, // 群 ID
            Group_Member_ID: member_arr[i].id, // 群成员 ID
            shield: 0,
          };
          // 添加群成员
          await new cluster(data).save();
          res.send(data);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  } catch (error) {}
};

// 获取群 ✔
exports.GetGroupList = async function ({ user_ID }, res) {
  await group
    .find({})
    .where({ user_ID })
    .sort({ time: -1 })
    .exec()
    .then((e) => res.send(e));
};

// 群成员
exports.ClusterMember = function (group_ID, res) {
  cluster
    .find({}, (err, data) => res.send(data))
    .where(group_ID)
    .populate("group_ID")
    .sort({ time: -1 });
};

// 获取群消息
exports.GetGroupMessages = function ({ Group_ID }, res) {
  let query = Group_news.find({}, (err, value) => {
    err && GlobalErr("GetGroupMessages", err);
    let data = value.map((item) => {
      return {
        message: item.message,
        time: item.time,
        types: item.types,
        name: item.Group_ID.group_name,
      };
    });
    res.send(data);
  });
  query.where({ Group_ID });
  query.populate("Group_ID");
  query.sort({ time: -1 });
};

// 群消息已读
exports.GroupMessageRead = function ({ User_ID, cluster_ID }, res) {
  let rule = { User_ID, cluster_ID, tip: "0" };
  cluster.updateOne(rule, (err, value) => {
    err && GlobalErr("GroupMessageRead", err);
    res.send({ status: 200 });
  });
};

// 分页数据  一半
exports.PagingData = function ({ Page, PageSize, user_ID, Friends_ID }, res) {
  if (Page * PageSize > total) {
    return res.send({ news: "没有更多数据了" });
  } else {
    let criteria = {
      $or: [
        { user_ID: user_ID, Friends_ID: Friends_ID },
        { user_ID: Friends_ID, Friends_ID: user_ID },
      ],
    };
    // 找我们两个的聊天记录
    Friends_chat.countDocuments(criteria, (err, number) => (total = number));
    let query = Friends_chat.find({}, (err, value) => {
      err && GlobalErr("PagingData", err);
      let data = value.map((item) => {
        return {
          id: item._id,
          message: item.message,
          types: item.types,
          time: item.time,
          formID: item.user_ID._id,
          img: item.user_ID.user_img,
        };
      });
      res.send(data);
    });
    query.where(criteria);
    query.sort({ _id: -1 }); // 从大到小,但只显示 10 条
    query.populate("user_ID");
    query.limit(PageSize); // 展示 10条
    query.skip(Page * PageSize); // 跳过的条 (2 x 10 = 20) 每次跳过之前的 10 再去加载 10 条
  }
};
