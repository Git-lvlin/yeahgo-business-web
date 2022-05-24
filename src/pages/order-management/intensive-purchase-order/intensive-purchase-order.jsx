/* eslint-disable prefer-destructuring */
import React, { useState, useRef } from 'react';
import { Button, Radio, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { operationList } from '@/services/order-management/intensive-purchase-order';
import { amountTransform } from '@/utils/utils'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'
import ImportHistory from '@/components/ImportFile/import-history'
import Import from '@/components/ImportFile/import'
import moment from 'moment';
import Detail from './detail';
import Ship from './ship';
import GroupShip from './group-ship';
import DistributionSingle from './distribution-single'
import styles from './styles.less'

const TableList = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [selectShipItem, setSelectShipItem] = useState([]);

  const [params, setParams] = useState({ status: 1 });
  const actionRef = useRef();
  const formRef = useRef();
  const [visit, setVisit] = useState(false)
  const [shipVisible, setShipVisible] = useState(false);
  const [groupShipVisible, setGroupShipVisible] = useState(false);
  const [importVisit, setImportVisit] = useState(false)
  const [printOrder, setPrintOrder] = useState(false)
  const [orderIdList, setOrderIdList] = useState([])
  const [exportBtn, setExportBtn] = useState(false)
  const [data, setData] = useState([])

  const [columns, setColumns] = useState([
    {
      title: '采购单号',
      dataIndex: 'poNo',
      render:(_,data)=>{
        return <>
                 <p>{_}</p>
                 {
                   data?.isRefund&&<span className={styles.mark}>{data?.isRefund}</span>
                 }
               </>
      }
    },
    {
      title: '订单类型',
      dataIndex: 'businessType',
      valueType: 'select',
      valueEnum: {
        1: '普适品',
        2: '精装生鲜',
        3: '散装生鲜'
      }
    },
    {
      title: '收货方',
      dataIndex: 'operationName',
    },
    {
      title: '采购商品',
      dataIndex: 'goodsName',
    },
    {
      title: '采购数量',
      dataIndex: 'totalNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '采购金额',
      dataIndex: 'totalPayment',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '应付款',
      dataIndex: 'orderAmount',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '已付款',
      dataIndex: 'paidAmount',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '未付款',
      dataIndex: 'unpaidAmount',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    // {
    //   title: '待发货数量',
    //   dataIndex: 'totalNum',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    {
      title: '库存单位',
      dataIndex: 'unit',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return (
          <Space>
            {record.status === 1 && <a onClick={() => { setSelectItem(record); setShipVisible(true); }}>发货</a>}
            <a onClick={() => { setSelectItem(record); setDetailVisible(true); }}>详情</a>
          </Space>
        )
      },
    },
  ])

  const getFieldValue = () => {
    if (formRef?.current?.getFieldsValue) {
      const user = JSON.parse(localStorage.getItem('user'))
      const { current, pageSize, createTime, ...rest } = formRef?.current?.getFieldsValue?.();
      const obj = {};

      if (createTime) {
        obj.beginTime = moment(createTime[0]).format('YYYY-MM-DD HH:mm:ss');
        obj.endTime = moment(createTime[1]).format('YYYY-MM-DD HH:mm:ss');
      }

      return {
        operatorSource: 1, operatorId: user.id, operatorName: user.username,
        poNos: orderIdList,
        ...rest, ...obj, ...params
      }
    }
    return {}
  }

  const setCheckbox = () => {
    if (params.status === 1 || params.status === 2) {
      return {
        rowSelection: {
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => {
            setOrderIdList(selectedRowKeys)
            setSelectShipItem(selectedRows)
          },
          selectedRowKeys: selectShipItem.map(item => item.poNo)
        }
      }
    }
    return {}
  }

  return (
    <PageContainer>
      <ProTable
        rowKey="poNo"
        options={{
          density: false,
          reload: true,
          fullScreen: false,
          setting: false,
        }}
        {...setCheckbox()}
        toolBarRender={() => [
          params.status === 2 &&
          <Button disabled={!data.length} key="print" type="primary" onClick={() => { setPrintOrder(true) }}>
            打印清单
          </Button>,
          params.status === 2 &&
          <Export
            key="3"
            change={(e) => { setExportBtn(e) }}
            type="supplier _send_good_d_export"
            conditions={getFieldValue}
            btnName="导出清单"
            disabled={!data.length}
          />,
          params.status === 2 &&
          <ExportHistory key="4" show={exportBtn} setShow={setExportBtn} type="supplier _send_good_d_export" />,
          params.status === 1 &&
          <Button disabled={!selectShipItem.length} key="button" type="primary" onClick={() => { setGroupShipVisible(true) }}>
            批量发货
          </Button>,
        ]}
        actionRef={actionRef}
        formRef={formRef}
        params={params}
        request={operationList}
        postData={(v)=>{
          setData(v)
          return v
        }}
        search={{
          defaultCollapsed: false,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields();
                form?.submit();
              }}
            >
              {resetText}
            </Button>,
            <Export
              key="3"
              change={(e) => { setVisit(e) }}
              type="supplier-intensive-delivery-order-export"
              conditions={getFieldValue}
            />,
            <ExportHistory key="4" show={visit} setShow={setVisit} type="supplier-intensive-delivery-order-export" />,
            <Import
              change={(e) => { setImportVisit(e) }}
              code="operate_purchase_order_send_goods_import"
              conditions={getFieldValue}
              key="5"
            />,
            <ImportHistory key="6" show={importVisit} setShow={setImportVisit} type="operate_purchase_order_send_goods_import" />
          ],
        }}
        toolbar={{
          multipleLine: true,
          filter: (
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              defaultValue={1}
              options={[
                {
                  label: '待发货',
                  value: 1,
                },
                {
                  label: '待收货',
                  value: 2,
                },
                {
                  label: '已完成',
                  value: 5,
                },
                {
                  label: '已关闭',
                  value: 7,
                },
              ]}
              onChange={(e) => {
                if (e.target.value === 1) {
                  setColumns(columns.map(item => {
                    if (item.title === '已发货数量') {
                      return {
                        ...item,
                        title: '待发货数量'
                      }
                    }
                    return item;
                  }))
                } else {
                  setColumns(columns.map(item => {
                    if (item.title === '待发货数量') {
                      return {
                        ...item,
                        title: '已发货数量'
                      }
                    }
                    return item;
                  }))
                }
                setParams({
                  status: e.target.value
                })
                setSelectShipItem([])
                actionRef.current.reload();
              }}
            />
          )
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
      {
        detailVisible &&
        <Detail
          id={selectItem?.poNo}
          visible={detailVisible}
          setVisible={setDetailVisible}
          callback={() => {
            setDetailVisible(false);
            setSelectItem(null);
            actionRef.current.reload();
          }}
        />
      }
      {
        shipVisible
        &&
        <Ship
          visible={shipVisible}
          setVisible={setShipVisible}
          data={selectItem}
          callback={() => {
            setShipVisible(false);
            setSelectItem(null);
            actionRef.current.reload();
          }}
        />
      }
      {groupShipVisible &&
        <GroupShip
          visible={groupShipVisible}
          setVisible={setGroupShipVisible}
          callback={() => { setSelectShipItem([]); actionRef.current.reload(); }}
          data={selectShipItem}
        />
      }
      {
        printOrder&&
        <DistributionSingle
          isModalVisible={printOrder}
          setVisible={setPrintOrder}
          orderId={orderIdList}
        />
      }
    </PageContainer>
  );
};

export default TableList;
