#1 格式化barcodes
input:
    inputs: [String]
output:
    formatItems: [{
        id: String,
        count: Number
    }]  
#2 计算单项总数
input:
  formatItems
output:
  menuItems[{
      id: String,
      count: Number
  }]
#3 计算小票项
input:
    allItems :[{
    id: String,
    name: String,
    price: Number
  },
    menuItems
output:
    receiptItems: [{
        id: String
        name: String,
        count: Number,
        subTotal: Number
    }]
#4 计算优惠信息
input:
    receiptItems
    loadPromotions
output:
     discountInfo:{
            type:Stirng,
            discountStr:String,
            saved:Number
        }
#5 计算total
input:
    receiptItems
    discountInfo.saved
output:
    total: Number


#6 生成viewModel
input:
    receiptItems
    total
    discountInfo
output:
    viewModel: {
        receiptItems: [{
            name: String,
            count: Number,
            price:Number,
            subTotal: Number    
        }],
        discountInfo:{
            type:Stirng,
            discountItems:String,
            saved:Number
        }
        total: Number
    }

#7 打印
input:
    viewModel
output:
    result: String
