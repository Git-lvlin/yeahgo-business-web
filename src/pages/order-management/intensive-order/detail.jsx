import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Space, Button, Modal, Steps, Spin } from 'antd';
import { getSupplierOrderDetail, modifyShip, delShip } from '@/services/order-management/intensive-order-detail';
import { orderShip } from '@/services/order-management/intensive-order';

import { amountTransform, dateFormat } from '@/utils/utils'
import ProDescriptions from '@ant-design/pro-descriptions';
import LogisticsTrackingModel from '@/components/Logistics-tracking-model'
import Delivery from '@/components/delivery'
import DeleteModal from '@/components/DeleteModal'
import { FormOutlined } from '@ant-design/icons';
import styles from './detail.less';

const { Step } = Steps;

const payType = {
  0: '模拟支付',
  1: '支付宝',
  2: '微信',
  3: '小程序',
  4: '银联',
  5: '钱包支付',
  6: '支付宝',
  7: '微信',
  8: '银联',
  9: '快捷支付'
}

const Detail = (props) => {
  const { visible, setVisible, id } = props;
  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  const [deliveryVisible, setDeliveryVisible] = useState(false)
  const [deliver, setDeliver] = useState(false)
  const [PressNo, setPressNo] = useState()
  const [logistics,setLogistics]=useState()


  const getDetailData = () => {
    setLoading(true);
    getSupplierOrderDetail({
      orderId:id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records)
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  const orderShipRequest = (values) => {
    orderShip({
      orderId: detailData.orderId,
      ...values,
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          getDetailData()
        }
      })

  }

  const modifyShipRequest = (values) => {
    modifyShip({
      orderId: detailData.orderId,
      oldExpressNo: PressNo,
      ...values,
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
          <Steps progressDot current={detailData.status}>
            {
              detailData?.Process?.map(item => (
                <Step title={item.name} description={<><div>{item.time}</div></>} />
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
                  <div>订单状态</div>
                  <div>{detailData.statusDisplay}</div>
                </div>
                <div className={styles.box}>
                  <div>订单号</div>
                  <div>{detailData.orderId}</div>
                </div>
                <div className={styles.box}>
                  <div>下单时间</div>
                  <div>{detailData.createTime}</div>
                </div>
                <div className={styles.box}>
                  <div>下单用户</div>
                  <div>{detailData?.store?.linkman}</div>
                </div>
                <div className={styles.box}>
                  <div>用户手机号</div>
                  <div>{detailData?.store?.phone}</div>
                </div>
                <div className={styles.box}>
                  <div>定金支付时间</div>
                  <div>{dateFormat(detailData?.payAdvance?.payTime * 1000)}</div>
                </div>
                <div className={styles.box}>
                  <div>定金支付方式</div>
                  <div>{payType[detailData?.payAdvance?.payType]}</div>
                </div>
                <div className={styles.box}>
                  <div>定金支付流水号</div>
                  <div>{detailData?.payAdvance?.thirdTransactionId}</div>
                </div>
                <div className={styles.box}>
                  <div>尾款支付类型</div>
                  <div>{detailData?.payFinal?.isPartialPay === 1 && '拼约尾款'}</div>
                </div>
                <div className={styles.box}>
                  <div>尾款支付时间</div>
                  <div>{dateFormat(detailData?.payFinal?.payTime * 1000)}</div>
                </div>
                <div className={styles.box}>
                  <div>尾款支付方式</div>
                  <div>{payType[detailData?.payFinal?.payType]}</div>
                </div>
                <div className={styles.box}>
                  <div>尾款支付流水号</div>
                  <div>{detailData?.payFinal?.thirdTransactionId}</div>
                </div>
                <div className={styles.box}>
                  <div>收货信息</div>
                  <div className={styles.block}>
                    <p>收货人：{detailData?.receivingInfo?.receiptUser}</p>
                    <p>收货手机号码：{detailData?.receivingInfo?.receiptPhone}</p>
                    <p>收货地址：{detailData?.receivingInfo?.receiptAddress}</p>
                  </div>
                </div>
              </div>
              <div className={styles.box_wrap} style={{ marginTop: '-1px' }}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  订单金额
                </div>
                <div className={styles.box}>
                  <div>定金</div>
                  <div className={styles.box_wrap}>
                    <div className={styles.box}>
                      <div>应付金额</div>
                      <div>{amountTransform(detailData?.advance?.amount, '/')}元</div>
                    </div>
                    <div className={styles.box}>
                      <div>红包</div>
                      <div>{amountTransform(detailData?.advance?.couponAmount, '/')}元</div>
                    </div>
                    <div className={styles.box}>
                      <div>用户实付</div>
                      <div>{amountTransform(detailData?.advance?.actualAmount, '/')}元</div>
                    </div>
                  </div>
                </div>
                <div className={styles.box}>
                  <div>尾款</div>
                  <div className={styles.box_wrap}>
                    <div className={styles.box}>
                      <div>应付金额</div>
                      <div>{amountTransform(detailData?.final?.amount, '/')}元（含运费）</div>
                    </div>
                    {/* <div className={styles.box}>
                      <div>运费</div>
                      <div>{amountTransform(detailData?.final?.shippingAmount, '/')}元</div>
                    </div> */}
                    <div className={styles.box}>
                      <div>用户实付</div>
                      <div>{amountTransform(detailData?.final?.actualAmount, '/')}元</div>
                    </div>
                  </div>
                </div>
                <div className={styles.box}>
                  <div>合计实收</div>
                  <div>{amountTransform(detailData?.actualAmount, '/')}元</div>
                </div>
                {
                  detailData.status != 0 && detailData.status != 6 &&
                  <div className={styles.box}>
                    <div>备注</div>
                    <div>买家付款后可提现 {detailData?.receivingInfo?.withdrawableCashRatio * 100 + '%'} 金额,订单超过售后期可提现剩余金额。</div>
                  </div>
                }
                {
                  <>
                    <div className={`${styles.box} ${styles.box_header}`}>
                      物流信息
                    </div>
                    {
                      detailData.express && detailData.express.map((ele, idx) => (
                        <ProDescriptions style={{ padding: '20px' }} column={detailData.status == 3 ? 3 : 2} title={"包裹" + parseInt(idx + 1)}>
                          <ProDescriptions.Item
                            label="快递公司"
                          >
                            {ele.expressName}
                          </ProDescriptions.Item>
                          <ProDescriptions.Item
                            label="运单编号"
                          >
                            {ele.expressNo}
                          </ProDescriptions.Item>
                          {
                            detailData.status == 3 &&
                            <ProDescriptions.Item>
                              <a onClick={() => {
                                setDeliveryVisible(true)
                                setPressNo(ele.expressNo)
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
                            detailData.status == 3 && detailData.express.length > 1 &&
                            <ProDescriptions.Item>
                              <DeleteModal
                                text={'确认要删除该订单吗？'}
                                byid={ele.id}
                                orderId={ele.orderId}
                                InterFace={delShip}
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
                <div className={styles.box}>
                  <div>商品1</div>
                  <div className={styles.box_wrap}>
                    <div className={styles.box}>
                      <div>商品名称</div>
                      <div>{detailData?.sku?.goodsName}</div>
                    </div>
                    <div className={styles.box}>
                      <div>规格</div>
                      <div>{detailData?.sku?.skuName}</div>
                    </div>
                    <div className={styles.box}>
                      <div>秒约价</div>
                      <div>{amountTransform(detailData?.sku?.price, '/')}元{detailData?.sku?.wholesaleFreight > 0 ? `（含平均运费¥${amountTransform(detailData?.sku?.wholesaleFreight, '/')}/${detailData?.sku?.unit}）` : ''}</div>
                    </div>
                    <div className={styles.box}>
                      <div>预定数量</div>
                      <div>{detailData?.sku?.totalNum}{detailData?.sku?.unit}</div>
                    </div>
                    <div className={styles.box}>
                      <div>实发数量</div>
                      <div>{detailData?.sku?.actualSendNum}{detailData?.sku?.unit}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.box}>
                  <div>买家留言</div>
                  <div>{detailData?.receivingInfo?.remark}</div>
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
                console.log('error', error)
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
