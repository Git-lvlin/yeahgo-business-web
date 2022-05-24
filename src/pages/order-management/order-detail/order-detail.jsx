import React, { useEffect, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Steps } from 'antd';
import { useParams } from 'umi';
import moment from 'moment';
import { findAdminOrderDetail } from '@/services/order-management/order-detail';

import styles from './style.less';

const { Step } = Steps;

const OrderDetail = () => {

  const params = useParams();
  const [detailData, setDetailData] = useState({});

  useEffect(() => {
    findAdminOrderDetail({
      id: params.id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records)
      }
    })
  }, [])

  return (
    <PageContainer style={{ backgroundColor: '#fff', height: '100%' }}>
      <div className={styles.order_detail}>
        <Steps progressDot current={1}>
          <Step title="订单提交" description={<><div style={{ whiteSpace: 'nowrap' }}>LUCAS（13800138000）</div><div>2020-12-18 15:05:16</div></>} />
          <Step title="订单支付" />
          <Step title="订单发货" />
          <Step title="订单收货" />
          <Step title="订单完成" />
        </Steps>
        <div style={{ display: 'flex', marginTop: 30 }}>
          <div style={{ flex: 1, marginRight: 30 }}>
            <div className={styles.box_wrap}>
              <div className={`${styles.box} ${styles.box_header}`}>
                订单信息
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
                <div>{detailData.createTime}</div>
              </div>
              <div className={styles.box}>
                <div>下单用户</div>
                <div></div>
              </div>
              <div className={styles.box}>
                <div>用户手机号</div>
                <div>{detailData.userPhone}</div>
              </div>
              <div className={styles.box}>
                <div>支付时间</div>
                <div>{detailData.paymentTime}</div>
              </div>
              <div className={styles.box}>
                <div>支付方式</div>
                <div>{detailData.payTypeStr}</div>
              </div>
              <div className={styles.box}>
                <div>支付流水号</div>
                <div>{ }</div>
              </div>
              <div className={styles.box}>
                <div>收货信息</div>
                <div className={styles.block}>
                  <p>收货人：{detailData.consignee}</p>
                  <p>收货手机号码：{detailData.phone}</p>
                </div>
              </div>
            </div>
            <div className={styles.box_wrap} style={{ marginTop: '-1px' }}>
              <div className={`${styles.box} ${styles.box_header}`}>
                订单金额
              </div>
              <div className={styles.box}>
                <div>商品总金额</div>
                <div>{detailData.goodsTotalAmount}元</div>
              </div>
              <div className={styles.box}>
                <div>运费</div>
                <div>+{detailData.shippingFeeAmount}元</div>
              </div>
              <div className={styles.box}>
                <div>红包</div>
                <div>-{detailData.couponAmount}元</div>
              </div>
              <div className={styles.box}>
                <div>用户实付</div>
                <div>-{detailData.payAmount}元</div>
              </div>
              <div className={styles.box}>
                <div>实收</div>
                <div>-{detailData.实收}元</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className={styles.box_wrap}>
              <div className={`${styles.box} ${styles.box_header}`}>
                商品信息
              </div>
              {
                detailData.goodsInfo.map((item, index) => (
                  <div className={styles.box}>
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
                        <div>秒约价</div>
                        <div>{item.skuSalePrice}</div>
                      </div>
                      <div className={styles.box}>
                        <div>购买数量</div>
                        <div>{item.skuNum}件</div>
                      </div>
                    </div>
                  </div>
                ))
              }
              <div className={styles.box}>
                <div>买家留言</div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}


export default OrderDetail
