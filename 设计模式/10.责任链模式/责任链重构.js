let order500 = function (orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log("500 元定金预购，得到 100 优惠券");
  } else {
    return "nextSuccessor"; // 我不知道下一个节点是谁，反正把请求往后面传递
  }
};

let order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log("200 元定金预购，得到 50 优惠券");
  } else {
    return "nextSuccessor"; // 我不知道下一个节点是谁，反正把请求往后面传递
  }
};

let orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log("普通购买，无优惠券");
  } else {
    console.log("手机库存不足");
  }
};

// Chain.prototype.setNextSuccessor 指定在链中的下一个节点
// Chain.prototype.passRequest 传递请求给某个节点
let Chain = function (fn) {
  this.fn = fn;
  this.successor = null;
};

Chain.prototype.setNextSuccessor = function (successor) {
  return this.successor = successor;
};

Chain.prototype.passRequest = function () {
  let ret = this.fn.apply(this, arguments);
  if (ret === "nextSuccessor") {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};

let chainOrder500 = new Chain(order500);
let chainOrder200 = new Chain(order200);
let chainOrderNormal = new Chain(orderNormal);

chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

chainOrder500.passRequest(1, true, 500);   // 输出:500 元定金预购，得到 100 优惠券
chainOrder500.passRequest(2, true, 500);   // 输出:200 元定金预购，得到 50 优惠券
chainOrder500.passRequest(3, true, 500);   // 输出:普通购买，无优惠券
chainOrder500.passRequest(1, false, 0);    // 输出:手机库存不足
