import React, { useState } from "react";
export default function Btn() {
  // 数组结构,初始值会赋给第一个,第二个是一个函数,改变第一个的值
  const [count, setCount] = useState(0); // 初始值
  const [obj, setobj] = useState({ name: "张三" }); // 初始值
  return (
    <div>
      <p>{count}</p>
      <p>{obj.name}</p>
      <p>{obj.age}</p>
      <button onClick={() => setCount(count + 1)}>数值按钮</button>
      <button onClick={() => setobj({ name: "李四", age: 15 })}>obj按钮</button>
    </div>
  );
}
