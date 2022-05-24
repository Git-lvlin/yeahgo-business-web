import React, { useEffect, useState } from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Button, Timeline, Empty } from 'antd'
import{ ModalForm } from '@ant-design/pro-form'
import moment from 'moment'

import { amountTransform } from '@/utils/utils'
import { expressInfo } from '@/services/order-management/after-sales-order'
import AddressSelect from './address-select'

import styles from './styles.less'
import './styles.less'

const { Item } = Timeline

const showLastStatus = lastStatus => {
  if(lastStatus){
    return lastStatus?.map((item)=>(
      <Item key={item.time}>
        <span className={styles.time}>{item.time}</span>
        {item.content}
      </Item>
    ))
  } else {
    return <Empty className={styles.empty}/>
  }
}

const ReturnInformation = props => {
  const { 
    data,
    list, 
    defaultList, 
    currentList,
    handleAddr,
    currentArr,
    defaultAddr
  } = props
  const [express, setExpress] = useState({})

  useEffect(() => {
    data?.returnShippingCode &&
    expressInfo({
      shippingCode: data?.returnShippingCode,
      expressType: data?.returnExpressType,
      mobile: data?.returnPhone,
      deliveryTime: data?.returnTime
    }).then(res => {
      setExpress(res?.data.records)
    })
    return ()=>{
      setExpress([])
    }
  }, [data])
  const showBusiness =() => {
    return (data?.status !== 1 && data?.afterSalesType === 2 ) ? false : true
  }
  const showStore =() => {
    return (data?.afterSalesType === 2) ? false : true
  }
  const showAddr =() => {
    if(currentList) {
      return currentList
    } else if(defaultList) {
      return defaultList
    } else {
      return '请选设置货地址'
    }
  }

  const storeRecipient =(data, defaultType, type) => {
    if(data) return data
    if(currentArr) return currentArr[type]
    if(defaultAddr) return defaultAddr[defaultType]
  }

  const columns = [
    {
      title: '商品退回方式',
      dataIndex: 'afterSalesType',
      valueType: 'select',
      valueEnum: {
        1: '无需退回',
        2: '快递寄送'
      },
    },
    {
      title: '售后类型',
      dataIndex: 'afterSalesType',
      valueEnum: {
        1: '退款',
        2: '退款退货'
      },
    },
    {
      title: '买家收货地址',
      dataIndex: 'receiveAddress',
      render: (_, records) => records.buyerDeliveryInfo?.fullAddress
    },
    {
      title: '买家昵称',
      dataIndex: 'buyerNickname'
    },
    {
      title: '买家手机号',
      dataIndex: 'buyerPhone'
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      valueType: 'dataTime',
      render: (_) => moment(_).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '订单编号',
      dataIndex: 'subOrderSn'
    },
    {
      title: '退款总金额',
      dataIndex: 'returnAmount',
      render:(_) =>`¥${amountTransform(_, '/').toFixed(2)}`
    },
    {
      hideInDescriptions: (data?.afterSalesType === 2 && data?.status === 1) ? false : true,
      title: '选择退货地址',
      dataIndex: 'returnAddress',
      render:() => (
        <AddressSelect
          address={list}
          onChange={e=> {handleAddr(e)}}
          value={showAddr()}
        />
      )
    },
    {
      title: '售后物流信息',
      dataIndex: 'returnGoodsInfo',
      hideInDescriptions: showBusiness(),
      render: () => {
        return(
          <div style={{display: 'flex', alignItems:'center'}}>
            <div>
              <div style={{marginBottom: 10}}>
                快递公司：
                <span style={{marginRight: 20}}>
                  {express?.expressName}
                </span>
              </div>
              <div>运单编号：
                <span style={{marginRight: 20}}>
                  {express?.shippingCode}
                </span>
              </div>
            </div>
            <ModalForm
              title='快递消息'
              width={800}
              modalProps={{
                destroyOnClose: true,
                closable: true
              }}
              trigger={
                <Button size="large" type="default">查看快递详情</Button>
              }
              onFinish={()=> true}
            >
              <Timeline className={styles.timelineWarp}>
                {showLastStatus(express?.deliveryList)}
              </Timeline>
            </ModalForm>
          </div>
        )
      }
    },
    {
      title: '商家收件人名称',
      dataIndex: 'receiveMan',
      hideInDescriptions: showStore(),
      render: (_) => {
        return storeRecipient(_, 'contactName', 'receiveMan')
      }
    },
    {
      title: '商家收货手机号',
      dataIndex: 'receivePhone',
      hideInDescriptions: showStore(),
      render: (_) => {
        return storeRecipient(_, 'contactPhone', 'receivePhone')
      }
    },
    {
      title: '商家收货地址',
      dataIndex: 'receiveAddress',
      hideInDescriptions: showStore(),
      render: (_) => {
        return storeRecipient(_, 'address', 'receiveAddress')
      }
    },
    {
      title: '商家收货时间',
      dataIndex: 'receiveTime',
      hideInDescriptions: showBusiness()
    }
  ]
  return (
    <ProDescriptions
      rowKey='orderNumber'
      className={styles.description}
      dataSource={props?.data}
      layout='horizontal'
      bordered
      title='售后单信息'
      column={1}
      columns={columns}
    />
  )
}

export default ReturnInformation
