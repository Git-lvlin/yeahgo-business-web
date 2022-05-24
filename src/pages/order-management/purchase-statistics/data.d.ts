export type TableListItem = {
  id: number
  goodsName: string
  imageUrl: string | undefined
  spuId: number
  businessType: number,
  totalNum: number,
  unit: string,
  orderNums: number,
  operationNums: number,
  ids: string
}

export type ExpandedListItem = {
  skuId: number
  skuName: string
  totalNum: number
  orderNums: number
  operationNums: number
}
