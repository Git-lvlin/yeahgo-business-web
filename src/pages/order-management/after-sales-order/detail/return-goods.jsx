import React from 'react'
import ProTable from '@ant-design/pro-table'
import {amountTransform} from '@/utils/utils'
import {Image} from 'antd'
import { history } from 'umi'

import styles from './styles.less'

const tableRow =props => {
  const imageArr =() => {
    const imgUrl = props[0]?.proofImageUrl?.split(',')
    return imgUrl?.map(url => {
      if(url) {
        return(
          <Image
            key={url}
            width={80}
            height={80}
            src={url}
          />
        )
      }
    })
  }
  return (
    <ProTable.Summary.Row>
      <ProTable.Summary.Cell colSpan={7}>
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            售后原因：
            <span className={styles.summaryItemText}>{props[0]?.reason}</span>
          </div>
          <div className={styles.summaryItem}>
            售后描述：
            <span className={styles.summaryItemText}>{props[0]?.description}</span>
          </div>
          <div className={styles.summaryImg}>
            <div className={styles.summaryItemTxt}>售后凭证：</div>
            <div className={styles.summaryItemPic}>
              <Image.PreviewGroup>
                { imageArr() }
              </Image.PreviewGroup>
            </div>
          </div>
        </div>
      </ProTable.Summary.Cell>
    </ProTable.Summary.Row>
  )
}

const skipToOrderDetail = (type, id) => {
  switch(type){
    case 1:
    case 2:
    case 3:
    case 4:
    case 11:
      history.push(`/order-management/normal-order-detail/${id}`)
    break
    case 15:
    case 16:
      history.push(`/order-management/intensive-order-detail/${id}`)
    break
    default:
      return ''
  }
}

const ReturnGoods = ({data})=> {

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'goodsInfo',
      align: 'center',
      width: 450,
      render: (_, records) => (
        <div className={styles.goodsInfo}>
          <Image 
            width={80} 
            src={records?.goodsImageUrl}
            height={80}
          />
          <div className={styles.goodsContent}>
            <div>{records?.goodsName}</div>
            <div className={styles.skuName}>{records?.skuName}</div>
          </div>
        </div>
      )
    },
    {
      title: '单价',
      dataIndex: 'skuSalePrice',
      align: 'center',
      render: (_) => `¥${amountTransform(Number(_), '/').toFixed(2)}`
    },
    { 
      title: '数量',
      dataIndex: 'returnNum',
      align: 'center' 
    },
    { 
      title: '库存单位',
      dataIndex: 'unit',
      align: 'center' 
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      align: 'center',
      render: (_, records) => `¥${amountTransform((records?.skuSalePrice * records?.returnNum), '/').toFixed(2)}`
    },
    {
      title: '实付金额',
      dataIndex: 'payAmount',
      align: 'center',
      render: (_) => `¥${amountTransform(Number(_), '/').toFixed(2)}`
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatusStr',
      align: 'center',
      render: (_, records) => (
        <>
          <div>{_}</div>
          <a onClick={()=>skipToOrderDetail(records?.orderType, records?.subOrderId)}>查看订单详情</a>
        </>
      )
    },
    {
      title: '应退金额',
      dataIndex: 'returnAmount',
      align: 'center',
      render: (_) => `¥${amountTransform(Number(_), '/').toFixed(2)}`
    }
  ]

  return (
    <ProTable
      rowKey="returnNum"
      pagination={false}
      columns={columns}
      bordered
      options={false}
      headerTitle="售后商品"
      search={false}
      dataSource={data}
      summary={tableRow}
    />
  )
}

export default ReturnGoods
