import React from 'react'
import ProTable from '@ant-design/pro-table'
import { history } from 'umi'
import moment from 'moment'

import { refundPendingApproval } from '@/services/order-management/intensive-after-sales'
import { amountTransform } from '@/utils/utils'

const skipDetail = id => {
  history.push(`/order-management/intensive-after-sales/detail/${id}`)
}
const TableList = props => {
  const { status } = props
  const columns = [
    {
      title: '售后单号',
      dataIndex: 'refundId',
      align: 'center'
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      align: 'center'
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      align: 'center',
      hideInSearch: true,
      render: (_)=> moment(_).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      title: '售后类型',
      dataIndex: 'refundType',
      valueType: 'select',
      valueEnum: {
        '1': '仅退款',
        '2': '退货退款',
      },
      align: 'center'
    },
    {
      title: '退款总金额（元）',
      dataIndex: 'refundTotalMoney',
      valueType: 'money',
      hideInSearch: true,
      align: 'center',
      render: (_, records)=>`¥${amountTransform(records.returnAmount,'/').toFixed(2)}`
    },
    {
      title: '退款原因',
      dataIndex: 'refundReason',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '退款状态',
      dataIndex: 'refundStatus',
      hideInSearch: true, 
      valueEnum: {
        1: '待审核',
        2: '拒绝审核',
        3: '待退货',
        4: '待退款',
        5: '拒绝退款',
        6: '退款中',
        7: '已完成',
        8: '已关闭'
      },
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, records) => {
        return (
          <a onClick={() => skipDetail(records?.refundId)}>
            查看详情
          </a>
        )
      }
    }
  ]

  return (
    <ProTable
      rowKey="refundId"
      pagination={{
        showQuickJumper: true,
        hideOnSinglePage: true,
        pageSize: 10
      }}
      headerTitle="数据列表"
      columns={ columns }
      options={ false }
      params={{status}}
      request={refundPendingApproval}
    />
  )
}

export default TableList