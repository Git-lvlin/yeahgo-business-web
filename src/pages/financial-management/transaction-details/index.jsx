import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { history, useLocation } from 'umi'
import { Button } from 'antd'

import { logPage, orderTypes } from '@/services/financial-management/account-management'
import { amountTransform } from '@/utils/utils'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

const Index = ()=> {
  const [visit, setVisit] = useState(false)
  const [data, setData] = useState(null)
  const {query} = useLocation()

  useEffect(() => {
    orderTypes({}).then(res=> {
      setData(res.data)
    })
    return () => {
      setData(null)
    }
  }, [])

  const skipToOrder = (id, type)=> {
    switch(type) {
      case 'commandSalesOrder':
      case 'activeSalesOrder':
      case 'commandCollect':
      case 'activeCollect':
        history.push(`/order-management/intensive-order-detail/${id}`)
      break
      default:
        return  history.push(`/order-management/normal-order-detail/${id}`)
    }
  }

  const getValues = (form) => {
    return {
      begin: form?.getFieldValue().createTime?.[0],
      end: form?.getFieldValue().createTime?.[1],
      ...form?.getFieldValue()
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'indexBorder'
    },
    {
      title: '交易类型',
      dataIndex: 'tradeType',
      valueType: 'select',
      valueEnum: {
        'goodsAmount': '货款',
        'goodsAmountReturn': '货款回退',  
        'unfreeze': '解冻',
        'freeze': '冻结',
        'withdraw': '提现',
        'freight': '运费',
        'freightReturn': '运费回退'
      }
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      valueType: 'select',
      valueEnum: data
    },
    {
      title: '订单号',
      dataIndex: 'billNo',
      render: (_, records) => (
        records.isSupplierOrder === 1 ? 
        <a onClick={()=>skipToOrder(records.orderId, records.orderType)}>{_}</a>:
        <span>{_}</span>
      )
    },
    {
      title: '支付单号',
      dataIndex: 'payNo'
    },
    {
      title: '资金流水号',
      dataIndex: 'transactionId'
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      hideInSearch: true
    },
    {
      title: '分账金额',
      dataIndex: 'divideAmount',
      render: (_) => amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      render: (_) => amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '其他扣款',
      dataIndex: 'deductAmount',
      render: (_) => amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '交易金额',
      dataIndex: 'changeAmount',
      render: (_)=> amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '交易后余额',
      dataIndex: 'balanceAmount',
      render: (_)=> amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '交易描述',
      dataIndex: 'description',
      hideInSearch: true
    }
  ]

  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="id"
        columns={columns}
        request={logPage}
        params={{...query}}
        options={false}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showQuickJumper: true
        }}
        search={{
          optionRender: ({searchText, resetText}, {form}) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit()
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields()
                form?.submit()
              }}
            >
              {resetText}
            </Button>,
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type="financial-supplier-account-log-page-export"
              conditions={()=> getValues(form)}
            />,
            <ExportHistory
              key="exportHistory"
              show={visit}
              setShow={setVisit}
              type="financial-supplier-account-log-page-export"
            />
          ],
        }}
      />
    </PageContainer>
  )
}

export default Index
