import React, { Component } from "react";
import { connect } from "react-redux";
class num extends Component {
  render() {
    return <div>{this.props.count}</div>;
  }
}
const mapStateToProps = (state) => {
  // 返回值,会存在当前组件里
  return state;
};
// connect(要接受数据的函数,要发送 action 的函数)(放入要加强的组件)
export default connect(mapStateToProps)(num);
