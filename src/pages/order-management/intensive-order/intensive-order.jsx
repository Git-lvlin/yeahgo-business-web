import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormText, ProFormDateTimeRangePicker, ProFormSelect } from '@ant-design/pro-form';
import { Button, Space, Radio, Descriptions, Pagination, Spin, Empty, Form, Checkbox } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import styles from './style.less';
import { orderList, orderShip } from '@/services/order-management/intensive-order';
import { amountTransform } from '@/utils/utils'
import Delivery from '@/components/delivery'
import Ship from './ship';
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'
import ImportHistory from '@/components/ImportFile/import-history'
import Import from '@/components/ImportFile/import'
import Detail from './detail';


const TableList = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageTotal, setPageTotal] = useState(0)
  const [orderType, setOrderType] = useState(2)
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [deliveryVisible, setDeliveryVisible] = useState(false)
  const [shipVisible, setShipVisible] = useState(false)
  const [form] = Form.useForm()
  const [selectItem, setSelectItem] = useState([]);
  const [visit, setVisit] = useState(false)
  const [importVisit, setImportVisit] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false);

  const pageChange = (a, b) => {
    setPage(a)
    setPageSize(b)
  }

  const orderTypeChange = (e) => {
    setOrderType(e.target.value)
    setPage(1)
  }

  const orderShipRequest = (values) => {
    orderShip({
      orderId,
      ...values,
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          setSearch(search + 1)
        }
      })
  }

  const selectAll = (e) => {
    const { target } = e;
    if (target.checked) {
      setSelectItem(data);
    } else {
      setSelectItem([])
    }
  }

  const select = (e, item) => {
    const { target } = e;
    if (target.checked) {
      const arr = [...selectItem]
      arr.push(item);
      setSelectItem(arr);
    } else {
      setSelectItem(selectItem.filter(it => it.id !== item.id))
    }
  }

  const getFieldValue = () => {
    const { time, ...rest } = form.getFieldsValue();

    return {
      status: orderType,
      startTime: time?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: time?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      operatorSource: 1,
      ...rest,
    }
  }

  useEffect(() => {
    setLoading(true);
    orderList({
      page,
      size: pageSize,
      ...getFieldValue(),
    })
      .then(res => {
        if (res.code === 0) {
          setData(res.data.records)
          setPageTotal(res.data.total)
          setSelectItem([])
        }
      })
      .finally(() => {
        setLoading(false);
      })
  }, [page, pageSize, orderType, form, search])
  return (
    <PageContainer>
      <ProForm
        // {...formItemLayout}
        form={form}
        style={{ backgroundColor: '#fff', padding: 10, paddingBottom: '0px' }}
        onFinish={() => {
          setPage(1)
          setSearch(search + 1)
        }}
        layout="inline"
        submitter={{
          render: ({ form }, doms) => {
            return (
              <div>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      form?.submit();
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                    }}
                  >
                    重置
                  </Button>
                  <Export
                    change={(e) => { setVisit(e) }}
                    type="order-intensive-export"
                    conditions={getFieldValue()}
                  />
                  <ExportHistory show={visit} setShow={setVisit} type="order-intensive-export" />
                  <Import
                    change={(e) => { setImportVisit(e) }}
                    code="order_intensive_send_goods_import"
                    conditions={getFieldValue()}
                  />
                  <ImportHistory show={importVisit} setShow={setImportVisit} type="order_intensive_send_goods_import" />
                </Space>
              </div>
            );
          },
        }}
      >
        <ProFormText
          label="订单号"
          name="orderId"
          fieldProps={{
            style: {
              marginBottom: 20,
            }
          }}
        />
        <ProFormText
          label="商品名称"
          name="goodsName"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="nickName"
          label="下单用户"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          label="下单手机号"
          name="phoneNumber"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        {/* <ProFormText
          label="所属商家"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        /> */}
        <ProFormSelect
          label="尾款类型"
          name="isMerge"
          options={[
            {
              value: 1,
              label: '拼约尾款'
            },
            {
              value: 0,
              label: '直接尾款'
            }
          ]}
          fieldProps={{
            style: {
              marginBottom: 20,
              width: 180,
            }
          }}
        />
        <ProFormDateTimeRangePicker
          name="time"
          label="下单时间"
          fieldProps={{
            style: {
              marginBottom: 20
            },
            showTime: true,
          }}
        />
        <ProFormText
          name="receiptUser"
          label="收件人"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="expressNo"
          label="物流单号"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormSelect
          label="订单类别"
          name="businessType"
          options={[
            {
              value: 1,
              label: '普通订单'
            },
            {
              value: 2,
              label: '生鲜订单'
            }
          ]}
          fieldProps={{
            style: {
              marginBottom: 20,
              width: 180,
            }
          }}
        />
      </ProForm>
      <Radio.Group
        style={{ marginTop: 20 }}
        buttonStyle="solid"
        optionType="button"
        size="large"
        value={orderType}
        onChange={orderTypeChange}
        options={[
          // {
          //   label: '全部订单',
          //   value: ''
          // },
          // {
          //   label: '待付款',
          //   value: 0
          // },
          {
            label: '已付订金',
            value: 1
          },
          {
            label: '已付尾款',
            value: 2
          },
          {
            label: '待收货',
            value: 3
          },
          {
            label: '已完成',
            value: 5
          },
          // {
          //   label: '已关闭',
          //   value: 6
          // },
        ]}
      />
      {orderType === 2 && <div onClick={() => { setShipVisible(true) }} style={{ marginTop: 10 }}><Button disabled={!selectItem.length} type="primary">批量发货</Button></div>}
      <Spin
        spinning={loading}
      >
        <div className={styles.list_header_wrap}>
          <div className={styles.list_header}>
            <div>{orderType === 2 && <div style={{ position: 'absolute' }}><Checkbox checked={selectItem.length === data.length && data.length !== 0} onChange={selectAll}>全选</Checkbox></div>}商品信息</div>
            <div>定金</div>
            <div>尾款</div>
            <div>合计实收</div>
            <div>订单状态</div>
            <div>操作</div>
          </div>
        </div>
        {data.length === 0 &&
          <div>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        }
        {
          data.map(item => (
            <div className={styles.list} key={item.orderId}>
              {/* <div className={styles.store_name}>所属商家：{item.storeName}</div> */}
              <div className={styles.second}>
                <Space size="large">
                  {orderType === 2 && <Checkbox onChange={(e) => { select(e, item) }} checked={selectItem.find(it => it.id === item.id)} />}
                  <span>下单时间：{moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                  <span>订单号：{item.orderId}</span>
                  <span>下单用户：{item.store.linkman}</span>
                  <span>用户手机号：{item.store.phone}</span>
                </Space>
              </div>

              <div className={styles.body}>
                <div className={styles.goods_info}>
                  <div>
                    <img width="100" height="100" src={item.sku.skuImageUrl} />
                    <div className={styles.info}>
                      <div>{item.sku.goodsName}</div>
                      <div>集约价：{amountTransform(item.sku.price, '/')}元{item?.sku?.wholesaleFreight > 0 ? `（含平均运费¥${amountTransform(item?.sku?.wholesaleFreight, '/')}/件）` : ''}<time style={{ marginLeft: 20 }}>规格：{item.sku.skuName}</time></div>
                      <div>数量： <span>{item.sku.totalNum}{item.sku.unit}</span></div>
                      <div>小计： <span>{amountTransform(item.sku.totalAmount, '/')}</span>元</div>
                    </div>
                  </div>
                </div>
                <div>
                  <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
                    <Descriptions.Item label="应付金额">{amountTransform(item.advance.amount, '/')}元</Descriptions.Item>
                    <Descriptions.Item label="红包">-{amountTransform(item.advance.couponAmount, '/')}元</Descriptions.Item>
                    <Descriptions.Item label="用户实付">{amountTransform(item.advance.actualAmount, '/')}元</Descriptions.Item>
                  </Descriptions>
                </div>
                <div>
                  {item.final &&
                    <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
                      <Descriptions.Item label="应付金额">{amountTransform(item.final.amount, '/')}元（含运费）</Descriptions.Item>
                      {/* <Descriptions.Item label="运费">+{amountTransform(item.final.shippingAmount, '/')}元</Descriptions.Item> */}
                      <Descriptions.Item label="用户实付">{amountTransform(item.final.actualAmount, '/')}元</Descriptions.Item>
                    </Descriptions>}
                </div>
                <div style={{ textAlign: 'center' }}>{amountTransform(item.actualAmount, '/')}元</div>
                <div style={{ textAlign: 'center' }}>{item.statusDisplay}</div>
                <div style={{ textAlign: 'center' }}>
                  {item.status === 2 && <><a onClick={() => { setDeliveryVisible(true); setOrderId(item.orderId) }}>发货</a> <br /></>}
                  {/* <a onClick={() => { history.push(`/order-management/intensive-order-detail/${item.orderId}`) }}>详情</a> */}
                  <a onClick={() => { setOrderId(item.orderId); setDetailVisible(true); }}>详情</a>
                </div>
              </div>

              <div className={styles.footer}>
                <Space size="large">
                  <span>收货人：{item.receivingInfo.receiptUser}</span>
                  <span>电话：{item.receivingInfo.receiptPhone}</span>
                  <span>地址：{item.receivingInfo.receiptAddress}</span>
                </Space>
              </div>
            </div>
          ))
        }
      </Spin>

      {
        detailVisible &&
        <Detail
          id={orderId}
          visible={detailVisible}
          setVisible={setDetailVisible}
        />
      }

      <div
        className={styles.pagination}
      >
        <Pagination
          total={pageTotal}
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
          pageSize={pageSize}
          current={page}
          onChange={pageChange}
        />
      </div>

      {deliveryVisible &&
        <Delivery
          visible={deliveryVisible}
          setVisible={setDeliveryVisible}
          callback={(values) => { orderShipRequest(values) }}
        />
      }
      {shipVisible &&
        <Ship
          visible={shipVisible}
          setVisible={setShipVisible}
          callback={() => { setSelectItem([]); setSearch(search + 1) }}
          data={selectItem}
        />
      }
    </PageContainer>
  );
};

export default TableList;
