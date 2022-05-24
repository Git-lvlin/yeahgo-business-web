import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Space, Button, Modal, Steps, Spin } from 'antd';
import { findAdminOrderDetail, deliverGoods, expressInfo, updateOrderLogistics, deleteOrderLogistics } from '@/services/order-management/normal-order-detail';
import { amountTransform } from '@/utils/utils'
import ProDescriptions from '@ant-design/pro-descriptions';
import LogisticsTrackingModel from '@/components/Logistics-tracking-model'
import Delivery from '@/components/delivery'
import DeleteModal from '@/components/DeleteModal'
import { FormOutlined } from '@ant-design/icons';
import styles from './detail.less';

const { Step } = Steps;

const Detail = (props) => {
  const { visible, setVisible, id } = props;
  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  const ref = useRef()
  const [deliveryVisible, setDeliveryVisible] = useState(false)
  const [deliver, setDeliver] = useState(false)
  const [orderId, setOrderId] = useState()
  const [logistics,setLogistics]=useState()


  const getDetailData = () => {
    setLoading(true);
    findAdminOrderDetail({
      id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records)
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  const orderShipRequest = (values) => {
    deliverGoods({
      subOrderId: id,
      shippingCode: values.expressNo,
      expressType: values.expressType,
      expressName: values.expressName,
      expressId: values.expressId
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          getDetailData()
        }
      })
  }
  const modifyShipRequest = (values) => {
    updateOrderLogistics({
      id: orderId,
      shippingCode: values.expressNo,
      expressType: values.expressType,
      expressId: values.expressId,
      expressName: values.expressName
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          getDetailData()
        }
      })
  }

  useEffect(() => {
    getDetailData();
  }, [])

  const getCurrent = () => {
    let current = 0;
    detailData?.nodeList?.forEach(item => {
      if (item.eventTime) {
        current += 1;
      }
    })
    return current - 1;
  }

  return (
    <Drawer
      title="订单详情"
      width={1200}
      placement="right"
      onClose={() => { setVisible(false) }}
      visible={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => { setVisible(false) }}>返回</Button>
          </Space>
        </div>
      }
    >
      <Spin spinning={loading}>
        <div className={styles.order_detail}>
          <Steps progressDot current={getCurrent()}>
            {
              detailData?.nodeList?.map(item => (
                <Step title={item.event} description={<><div>{item.eventTime?.replace('T', ' ')}</div></>} />
              ))
            }
          </Steps>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ flex: 1, marginRight: 30 }}>
              <div className={styles.box_wrap}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  订单信息
                </div>
                <div className={styles.box}>
                  <div>订单类型</div>
                  <div>{detailData.orderTypeStr}</div>
                </div>
                <div className={styles.box}>
                  <div>订单状态</div>
                  <div>{detailData.statusStr}</div>
                </div>
                <div className={styles.box}>
                  <div>订单号</div>
                  <div>{detailData.orderSn}</div>
                </div>
                <div className={styles.box}>
                  <div>下单时间</div>
                  <div>{detailData?.createTime}</div>
                </div>
                <div className={styles.box}>
                  <div>下单用户</div>
                  <div>{detailData?.buyerNickname}</div>
                </div>
                <div className={styles.box}>
                  <div>用户手机号</div>
                  <div>{detailData?.buyerPhone}</div>
                </div>
                <div className={styles.box}>
                  <div>支付时间</div>
                  <div>{detailData?.payTime}</div>
                </div>
                <div className={styles.box}>
                  <div>支付方式</div>
                  <div>{detailData?.payTypeStr}</div>
                </div>
                <div className={styles.box}>
                  <div>支付流水号</div>
                  <div>{detailData?.paySn}</div>
                </div>
                <div className={styles.box}>
                  <div>收货信息</div>
                  <div className={styles.block}>
                    <p>收货人：{detailData?.consignee}</p>
                    <p>收货手机号码：{detailData?.phone}</p>
                    <p>收货地址：{detailData?.fullAddress}</p>
                  </div>
                </div>
              </div>
              <div className={styles.box_wrap} style={{ marginTop: '-1px' }}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  订单金额
                </div>
                <div className={styles.box}>
                  <div>商品总金额</div>
                  <div>{amountTransform(detailData?.goodsTotalAmount, '/')}元</div>
                </div>
                <div className={styles.box}>
                  <div>运费</div>
                  <div>+{amountTransform(detailData?.shippingFeeAmount, '/')}元</div>
                </div>
                <div className={styles.box}>
                  <div>红包</div>
                  <div>-{amountTransform(detailData?.couponAmount, '/')}元{detailData?.orderType === 18 ? '（签到红包）' : ''}</div>
                </div>
                <div className={styles.box}>
                  <div>用户实付</div>
                  <div>{amountTransform(detailData?.payAmount, '/')}元</div>
                </div>
                {
                  detailData.status != 1 && detailData.status != 5 && <div className={styles.box}>
                    <div>备注</div>
                    <div>买家确认收货后可提现 {detailData?.warrantyRatio * 100 + '%'}  金额,订单超过售后期可提现剩余金额。</div>
                  </div>
                }
                {/* <div className={styles.box}>
                    <div>实收</div>
                    <div>{amountTransform(detailData?.incomeAmount, '/')}</div> 
                  </div> */}
                {
                  <>
                    <div className={`${styles.box} ${styles.box_header}`}>
                      物流信息
                    </div>
                    {
                      detailData.logisticsList && detailData.logisticsList.map((ele, idx) => (
                        <ProDescriptions ref={ref} style={{ padding: '20px' }} column={detailData.status == 3 ? 3 : 2} title={"包裹" + parseInt(idx + 1)}>
                          <ProDescriptions.Item
                            label="快递公司"
                          >
                            {ele.expressName}
                          </ProDescriptions.Item>
                          <ProDescriptions.Item
                            label="运单编号"
                          >
                            {ele.shippingCode}
                          </ProDescriptions.Item>
                          {
                            detailData.status == 3 &&
                            <ProDescriptions.Item>
                              <a onClick={() => {
                                setDeliveryVisible(true)
                                setOrderId(ele.id)
                                setLogistics({expressName:ele.expressName,shippingCode:ele.shippingCode})
                                setDeliver(false)
                              }}>
                                <FormOutlined style={{ fontSize: '20px', color: '#20263B' }} />
                              </a>
                            </ProDescriptions.Item>
                          }
                          <ProDescriptions.Item
                            label="物流进度"
                          >
                            <p className={styles.schedule}>{ele.lastStatus}</p>
                          </ProDescriptions.Item>

                          <ProDescriptions.Item
                            fieldProps={{}}
                          >
                            <LogisticsTrackingModel
                              record={ele.deliveryList}
                              title={'物流跟踪'}
                              byid={ele.id}
                            />
                          </ProDescriptions.Item>
                          {
                            detailData.status == 3 && detailData.logisticsList.length > 1 &&
                            <ProDescriptions.Item>
                              <DeleteModal
                                boxref={ref}
                                text={'确认要删除该订单吗？'}
                                byid={ele.id}
                                InterFace={deleteOrderLogistics}
                                title={'操作确认'}
                                getDetailData={getDetailData}
                              />
                            </ProDescriptions.Item>
                          }
                        </ProDescriptions>
                      ))
                    }
                  </>
                }
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.box_wrap}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  商品信息
                </div>
                {
                  detailData?.goodsInfo?.map((item, index) => (
                    <div key={item.id} className={styles.box}>
                      <div>商品{index + 1}</div>
                      <div className={styles.box_wrap}>
                        <div className={styles.box}>
                          <div>商品名称</div>
                          <div>{item.goodsName}</div>
                        </div>
                        <div className={styles.box}>
                          <div>规格</div>
                          <div>{item.skuName}</div>
                        </div>
                        <div className={styles.box}>
                          <div>样品价</div>
                          <div>{amountTransform(item.skuSalePrice, '/')}元</div>
                        </div>
                        <div className={styles.box}>
                          <div>购买数量</div>
                          <div>{item.skuNum}{item.unit}</div>
                        </div>
                        <div className={styles.box}>
                          <div>小计</div>
                          <div>
                            {amountTransform(item.totalAmount, '/')}元
                            {item.afterSalesStatus!==0&&
                            <a 
                            href={`/order-management/after-sales-order/detail/${item.afterSalesApplyId}`}
                            target="_blank" 
                            className={styles.after_sale}>
                              {item.afterSalesStatusStr}
                            </a>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
                <div className={styles.box}>
                  <div>买家留言</div>
                  <div>{detailData?.note}</div>
                </div>
              </div>
              <Space style={{ marginTop: 30 }}>
                {detailData.status === 2 && <Button type="primary" onClick={() => { setDeliveryVisible(true), setDeliver(true) }}>发货</Button>}
                {detailData.status === 3 && <Button type="primary" onClick={() => { setDeliveryVisible(true), setDeliver(true) }}>添加物流</Button>}
              </Space>
            </div>
          </div>
        </div>
        {deliveryVisible &&
          <Delivery
            visible={deliveryVisible}
            setVisible={setDeliveryVisible}
            callback={(values) => {
              try {

                deliver ? orderShipRequest(values) : modifyShipRequest(values)
              } catch (error) {
                console.log('error', error);
              }
            }}
            data={{
              expressId: !deliver&&logistics?.expressName,
              expressNo: !deliver&&logistics?.shippingCode
            }}
          />
        }
      </Spin>
    </Drawer>
  )
}

export default Detail;
