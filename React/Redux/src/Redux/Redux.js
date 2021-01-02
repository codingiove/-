// 添加数据
const Default = {
  num: "默认值",
  list: ["0", "1", "2"],
};
// 把数据导出
export default function (state = Default, action) {
  switch (action.type) {
    case "0":
      return (state = action.state);
    default:
      return state;
  }
}
