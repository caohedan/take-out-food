const loadAllItems = require('../src/items');
const loadPromotions = require('../src/promotions');
function bestCharge(selectedItems) {
  const allItems = loadAllItems();
  const allPromotions = loadPromotions();
  let formatedItems = formatItems(selectedItems);
  let menuItems = buildItems(formatedItems);
  let receiptItems = buildReceiptItems(allItems, menuItems);
  let discountedInfo = discountInfo(receiptItems, allPromotions);
  let total = countTotal(receiptItems, discountedInfo.saved);
  let receiptStr = generateReceipt(discountedInfo, receiptItems, total);
  return receiptStr;
}
function formatItems(selectedItems) {
  return selectedItems.map((item) => {
    let [id, count] = item.split("x");
    return {
      id: id.trim(),
      count: parseInt(count)
    }
  })
  return selectedItems;
}
function buildItems(formattedBarcodes) {
  let cartItems = [];

  for (let formattedBarcode of formattedBarcodes) {
    let existCartItem = null;
    for (let cartItem of cartItems) {
      if (cartItem.id === formattedBarcode.id) {
        existCartItem = cartItem;
      }
    }
    if (existCartItem != null) {
      existCartItem.count += formattedBarcode.count;
    } else {
      cartItems.push({ ...formattedBarcode });
    }
  }

  console.info(cartItems);
  return cartItems;
}
function buildReceiptItems(allItems, menuItems) {
  let receiptItems = menuItems.map((item) => {
    for (let product of allItems) {
      let { name, price } = product
      if (product.id === item.id) {
        subtotal = parseInt(price * item.count)
        return {
          id: item.id,
          name,
          count: item.count,
          subTotal: subtotal
        }
      }
    }
  })
  console.log(receiptItems);
  return receiptItems;

}
function discountInfo(receiptItems, allPromotions) {
  let discountCash = 0;
  let subCash = 0;
  let discountSet = new Set();
  let discountStr;
  let subPromotions = allPromotions[0];
  let halfPromotions = allPromotions[1];
  let saved = 0;
  let type;
  for (let item of receiptItems) {
    for (promotion of halfPromotions.items) {
      if (promotion === item.id) {
        discountCash = parseInt(discountCash + item.subTotal / 2);
        discountSet.add(item.name);
      }
    }
    subCash = subCash + item.subTotal;
  }
  subCash = parseInt(subCash / 30) * 6;
  if (discountCash > subCash) {
    saved = discountCash;
    type = halfPromotions.type;
    discountStr = "(";
    discountStrs = Array.from(discountSet);
    for (let str of discountStrs) {
      if (str === discountStrs[discountStrs.length - 1])
        discountStr = discountStr + str + ")";
      else
        discountStr = discountStr + str + "，"
    }
  }
  else {
    saved = subCash;
    type = subPromotions.type;
    discountStr = "";
  }
  let discountInfo = {
    type,
    saved,
    discountStr
  }
  console.log(discountInfo);
  return discountInfo;
}
function countTotal(receiptItems, saved) {
  let total = 0;
  for (let item of receiptItems)
    total = total += item.subTotal;
  total = total - saved;
  console.log(total);
  return parseInt(total);
}
function generateReceipt(discountedInfo, receiptItems, total) {
  let receiptItemString = "";

  for (let item of receiptItems) {
    receiptItemString += "\n";
    receiptItemString += `${item.name} x ${item.count} = ${item.subTotal}元`;
  }
  let savedStr = `\n使用优惠:
${discountedInfo.type}${discountedInfo.discountStr}，省${discountedInfo.saved}元
-----------------------------------`;
  if (discountedInfo.saved === 0)
    savedStr = "";
  let receiptStr = `============= 订餐明细 =============${receiptItemString}
-----------------------------------${savedStr}
总计：${total}元
===================================`
  return receiptStr;
}
  module.exports = {formatItems, bestCharge,discountInfo };