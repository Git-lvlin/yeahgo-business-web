import React, { useState, useEffect } from 'react';
import { Drawer, Typography, Space, Button, Divider, Row, Col, Table, Modal, Steps, Popconfirm } from 'antd';
import { detail, expressInfo, expressDelete, expressEdit } from '@/services/order-management/intensive-purchase-order'
import { amountTransform } from '@/utils/utils'
import moment from 'moment';
import Ship from './ship';
import styles from './styles.less'

const { Title } = Typography;
const { Step } = Steps;

const Detail = (props) => {
  const { visible, setVisible, id, callback } = props;
  const [detailData, setDetailData] = useState({});
  const [expressInfoState, setExpressInfoState] = useState([]);
  const [shipVisible, setShipVisible] = useState(false);
  const [selectShipItem, setSelectShipItem] = useState(null);
  const [columns, setColumns] = useState([
    {
      title: '采购商品',
      dataIndex: 'spuId',
      render: (_, data) => {
        return (
          <div style={{ display: 'flex' }}>
            <img src={data.goodsImageUrl} width={50} height={50} />
            <div style={{ marginLeft: 10 }}>
              <div>{data.goodsName}</div>
              <div>{data.goodsSkuName}</div>
            </div>
          </div>
        )
      }
    },
    {
      title: '采购数量',
      dataIndex: 'goodsSkuNums',
    },
    {
      title: '采购金额',
      dataIndex: 'goodsPayment',
      render: (_) =>{
        if(_){
          return  amountTransform(_, '/').toFixed(2)
        }else{
          return  amountTransform(_, '/')
        }
      },
    },
    // {
    //   title: '已发货数量',
    //   dataIndex: 'goodsSkuNums',
    // },
    {
      title: '库存单位',
      dataIndex: 'unit',
    },
    {
      title: '缺货数量',
      dataIndex: 'refundReturnNum',
    },
    {
      title: '缺货退款金额',
      dataIndex: 'refundMoney',
      render: (_) =>{
        if(_){
          return  amountTransform(_, '/').toFixed(2)
        }else{
          return  amountTransform(_, '/')
        }
      },
    },
    {
      title: '发货类型',
      dataIndex: 'statusDesc',
    }
  ]);

  const getExpressInfo = (record) => {
    expressInfo({
      shippingCode: record.expressNo,
      expressType: record.companyNo,
      mobile: detailData.operationReceiptPhone,
      deliveryTime: record.expressTime
    })
      .then(res => {
        if (res.code === 0) {
          setExpressInfoState(res?.data?.records?.deliveryList || []);
        }
      })
  }

  const getDetail = () => {
    detail({
      poNo: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records)
        if (res.data.records.status === 1) {
          setColumns([
            {
              title: '采购商品',
              dataIndex: 'spuId',
              render: (_, data) => {
                return (
                  <div style={{ display: 'flex' }}>
                    <img src={data.goodsImageUrl} width={50} height={50} />
                    <div style={{ marginLeft: 10 }}>
                      <div>{data.goodsName}</div>
                      <div>{data.goodsSkuName}</div>
                    </div>
                  </div>
                )
              }
            },
            {
              title: '采购数量',
              dataIndex: 'goodsSkuNums',
            },
            {
              title: '采购金额',
              dataIndex: 'goodsPayment',
              render: (_) =>{
                if(_){
                  return  amountTransform(_, '/').toFixed(2)
                }else{
                  return  amountTransform(_, '/')
                }
              },
            },
            // {
            //   title: '待发货数量',
            //   dataIndex: 'goodsSkuNums',
            // },
            {
              title: '库存单位',
              dataIndex: 'unit',
            },
            {
              title: '缺货数量',
              dataIndex: 'refundReturnNum',
            },
            {
              title: '缺货退款金额',
              dataIndex: 'refundMoney',
              render: (_) =>{
                if(_){
                  return  amountTransform(_, '/').toFixed(2)
                }else{
                  return  amountTransform(_, '/')
                }
              },
            },
            {
              title: '发货类型',
              dataIndex: 'statusDesc',
            }
          ])
        }
      }
    })
  }

  const columns2 = [
    {
      title: '包裹',
      dataIndex: 'goodsSkuNums',
      render: (a, b, c) => c + 1
    },
    {
      title: '物流公司',
      dataIndex: 'expressName',
    },
    {
      title: '物流单号',
      dataIndex: 'expressNo',
    },
    {
      title: '发货时间',
      dataIndex: 'expressTime',
      render: (_) => moment(_ * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => {
        return (
          <Space>
            <a onClick={() => { getExpressInfo(record) }}>查看进度</a>
            {detailData?.expressList?.length > 1 && detailData.status === 2  &&  <Popconfirm
              title="确认要删除吗"
              onConfirm={() => {
                expressDelete({
                  poNo: detailData.poNo,
                  supplierId: detailData.supplierId,
                  expressNo: record.expressNo
                }, { showSuccess: true })
                  .then(res => {
                    if (res.code === 0) {
                      getDetail();
                    }
                  })
              }}
            >
              <a>删除</a>
            </Popconfirm>}
            {detailData.status === 2 && <a onClick={() => { setShipVisible(true); setSelectShipItem(record) }}>编辑</a>}
          </Space>
        )
      },
    },
  ]



  useEffect(() => {
    getDetail();
  }, [])

  return (
    <Drawer
      title={<p>订单详情  {detailData?.isRefund&&<span className={styles.mark}>{detailData?.isRefund}</span>}</p>}
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
      <Title style={{ marginBottom: -20 }} level={5}>基本信息</Title>
      <Divider />
      <Row gutter={[0, 16]}>
        <Col span={24}>采购单号：{detailData?.poNo}</Col>
        <Col span={24}>订单状态：{detailData?.statusDesc}</Col>
        <Col span={24}>创建时间：{detailData?.createTime}</Col>
      </Row>

      <Title style={{ marginBottom: -20, marginTop: 30 }} level={5}>付款信息</Title>
      <Divider />
      <Row gutter={[0, 16]}>
        <Col span={24}>应付金额：{amountTransform(detailData?.orderAmount, '/')}元</Col >
        <Col span={24}>已付金额：{amountTransform(detailData?.paidAmount, '/')}元</Col>
        <Col span={24}>未付金额：{amountTransform(detailData?.unpaidAmount, '/')}元</Col>
      </Row>

      <Title style={{ marginBottom: -20, marginTop: 30 }} level={5}>收货信息</Title>
      <Divider />
      <Row gutter={[0, 16]}>
        <Col span={24}>收货方：{detailData?.operationName}</Col >
        <Col span={24}>收货人：{detailData?.operationReceiptUser}</Col>
        <Col span={24}>手机号：{detailData?.operationReceiptPhone}</Col>
        <Col span={24}>收货地址：{detailData?.operationReceiptAddress}</Col>
      </Row>

      <Title style={{ marginBottom: -20, marginTop: 30 }} level={5}>商品信息</Title>
      <Divider />
      <Row gutter={[0, 16]}>
        <Table style={{ width: '100%' }} rowKey="goodsSkuId" pagination={false} dataSource={[detailData]} columns={columns} />
      </Row>

      <Title style={{ marginBottom: -20, marginTop: 30 }} level={5}>物流信息</Title>
      <Divider />
      <Row gutter={[0, 16]}>
        <Table style={{ width: '100%' }} rowKey="expressId" pagination={false} dataSource={detailData?.expressList} columns={columns2} />
      </Row>

      {detailData?.status === 1 && <Button style={{ marginTop: 20 }} type="primary" onClick={() => { setSelectShipItem(null); setShipVisible(true) }}>立即发货</Button>}
      {detailData?.status === 2 && <Button style={{ marginTop: 20 }} type="primary" onClick={() => { setSelectShipItem(null); setShipVisible(true) }}>添加物流</Button>}

      {
        shipVisible
        &&
        <Ship
          visible={shipVisible}
          setVisible={setShipVisible}
          data={{
            poNo: detailData.poNo,
            receiptUser: detailData.operationReceiptUser,
            receiptPhone: detailData.operationReceiptPhone,
            receiptAddress: detailData.operationReceiptAddress,
            supplierId: detailData.supplierId,
            expressInfo: selectShipItem,
          }}
          type={selectShipItem ? 2 : 1}
          callback={() => {
            if (detailData.status !== 2) {
              callback();
            }
            getDetail();
          }}
        />
      }

      {!!expressInfoState.length && <Modal
        title="物流跟踪"
        visible={expressInfoState.length}
        footer={[
          <Button key="1" type="primary" onClick={() => { setExpressInfoState([]) }}>
            确定
          </Button>,
        ]}
        onCancel={() => { setExpressInfoState([]) }}
      >
        <Steps progressDot current={999} direction="vertical">
          {
            expressInfoState.map(item => (
              <Step key={item.time} title={item.content} description={item.time} />
            ))
          }
        </Steps>
      </Modal>}
    </Drawer>
  )
}

export default Detail;
