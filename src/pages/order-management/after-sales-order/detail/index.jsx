import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Empty, Spin } from 'antd'
import { useParams, history } from 'umi'

import NegotiationHistory from '../negotiation-history/negotiation-history'
import ReturnGoods from './return-goods'
import ReturnInformation from './return-information'
import OrderDetailStatus from './order-details-status'
import { refundOrderDetail, findReturnRecord, addressList } from '@/services/order-management/after-sales-order'

import styles from './styles.less'
import './styles.less'

const Details = () => {
  const params = useParams()
  const [detailData, setDetailData] = useState({})
  const [goodsDetail, setGoodsDetail] = useState([])
  const [loading, setLoading] = useState(false)
  const [flag, setFlag] = useState(0)
  const [consultationRecord, setConsultationRecord] = useState([])
  const [address, setAddress] = useState([])
  const [defaultAddress, setDefaultAddress] = useState([])
  const [currentAddr, setCurrentAddr] = useState([])
  useEffect(() => {
    addressList().then(res => {
      setDefaultAddress(res.data?.filter(item => item.isDefault))
      setAddress(res.data?.map(item => ({'receiveAddress':item?.address, 'companyAddressId':item?.id, 'receiveMan':item?.contactName, 'receivePhone':item?.contactPhone})))
    })
    return ()=>{
      setDefaultAddress([])
      setAddress([])
    }
  }, [])
  const list = address.map(item=> ({label: item?.receiveAddress, value: item?.companyAddressId}))
  const currentData = e => setCurrentAddr(address.filter(item=> item.companyAddressId === e))
  useEffect(() => {
    findReturnRecord(params).then(res=> {
      if(res.success) setConsultationRecord(res?.data)
    })
    return ()=> {
      setConsultationRecord([])
    }
  }, [flag])
  useEffect(() => {
    setLoading(true)
    refundOrderDetail(params).then(res => {
      setDetailData(res?.data)
      setGoodsDetail([res?.data])
    }).finally(() => {
      setLoading(false)
    })
    return ()=> {
      setDetailData({})
      setGoodsDetail([])
    }
  }, [flag])

  const handleBack = () => {
    history.goBack()
  }
  return (
    <PageContainer
      title={false}
    >
      <Spin spinning={loading}>
        <OrderDetailStatus
          address={address}
          data={detailData}
          change={setFlag}
          value={flag}
          currentArr={currentAddr[0]}
          defaultAddr={defaultAddress}
        />
        <ReturnGoods data={goodsDetail} />
        <ReturnInformation
          list={list}
          handleAddr={e=>currentData(e)}
          defaultList={defaultAddress[0]?.address}
          currentList={currentAddr[0]?.receiveAddress}
          currentArr={currentAddr[0]}
          defaultAddr={defaultAddress[0]}
          data={detailData}
        />
        { <div className={styles.negotiation}>协商历史</div> }
        {
          consultationRecord?.length === 0 ? 
          <Empty className={styles.empty}/>:
          <NegotiationHistory data={consultationRecord} />
        }
        <div className={styles.btn}>
          <Button
            type='primary'
            size='large'
            onClick={handleBack}
          >
            返回
          </Button>
        </div>
      </Spin>
    </PageContainer>
  )
}

export default Details
