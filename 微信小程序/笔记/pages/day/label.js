Page({
  /* 页面的初始数据*/
  data: {
    message: "data数据绑定",
    num: 824,
    obj: {
      name: "koko",
      age: 14,
      height: 178,
    },
    isgirl: false,
    model: "",
    addnum: "传过来的参数:",
    son: "",
    globalData: getApp().globalData.appjsData,
  },
  click(e) {
    this.setData({
      model: e.detail.value,
    });
  },
  add(e) {
    let argument = e.currentTarget.dataset.argument;
    this.setData({
      //addnum:argument //这样会覆盖用来的值,但我想要的结果是(传过来的参数:koko)
      addnum: this.data.addnum + argument,
    });
  },
  hhhh(e) {
    this.setData({
      son: e.detail,
    });
  },
});
