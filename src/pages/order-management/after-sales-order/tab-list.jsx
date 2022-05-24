import React from 'react'
import ProTable from '@ant-design/pro-table'
import { history } from 'umi'

import { refundPendingApproval } from '@/services/order-management/after-sales-order'
import { amountTransform } from '@/utils/utils'
import moment from 'moment'

const skipDetail = (id) => {
  history.push(`/order-management/after-sales-order/detail/${id}`)
}
const TableList = ({status}) => {
  const columns = [
    {
      title: '售后单号',
      dataIndex: 'orderSn',
      align: 'center',
      render: (_, records) => {
        return(
          <>
            <div>{ records?.orderSn }</div>
            <div>
              { 
                records?.platformInvolved === 1&& 
                <span
                  style={{
                    background: 'rgba(250, 205, 145, 1)', 
                    fontSize: 12,
                    padding: 4,
                    borderRadius: 5
                  }}
                >
                  平台已介入
                </span> 
              }
            </div>
          </>
        )
      }
    },
    {
      title: '订单编号',
      dataIndex: 'subOrderSn',
      align: 'center',
      valueType: 'string'
    },
    {
      title: '买家昵称',
      dataIndex: 'nickname',
      hideInTable: true
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
      dataIndex: 'afterSalesType',
      valueType: 'select',
      valueEnum: {
        '': '全部',
        '1': '仅退款',
        '2': '退货退款',
      },
      align: 'center'
    },
    {
      title: '退款总金额（元）',
      dataIndex: 'returnAmount',
      valueType: 'money',
      hideInSearch: true,
      align: 'center',
      render: (_, records)=>`¥${amountTransform(records.returnAmount,'/').toFixed(2)}`
    },
    {
      title: '退款原因',
      dataIndex: 'reason',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '退款状态',
      dataIndex: 'status',
      hideInSearch: true, 
      valueEnum: {
        1: '待审核',
        2: '处理中',
        3: '已拒绝申请',
        4: '已拒绝退款',
        5: '已完成',
        6: '已关闭'
      },
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, records) => <a onClick={() => skipDetail(records?.id)}>查看详情</a>
    }
  ]

  return (
    <ProTable
      rowKey="orderSn"
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