
// 云函数入口函数
exports.main = (event, context) => {
  console.log("hello world1")
  console.log("---------------end")
  return {
    sum: event.a + event.b
  }
}