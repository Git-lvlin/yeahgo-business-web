import React, { useState, useEffect, useRef } from 'react'
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { withdrawPage } from '@/services/financial-management/withdrawal-record'
import moment from 'moment'
import { amountTransform } from '@/utils/utils'
import { PageContainer } from '@ant-design/pro-layout';
import { useLocation } from 'umi';
import Detail from '@/pages/order-management/normal-order/detail';
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'


type WithdrawPage={
  bankAcctType?: any;
  bankName: string;
  registMobile: string;
  sn: string;
  status: string;
  amount: string;
  fee: string;
  withdrawAccount: string;
  withdrawAccountName: string;
  realName: string;
  reason: string;
  paymentType?: any;
  voucher: string;
  auditUserId: string;
  auditUserName: string;
  auditTime: string;
  paymentUserId?: any;
  paymentUserName: string;
  paymentTime?: any;
  memo: string;
  createTime: string;
  id: string;
  withdrawType: string;
}

export default () => {
  const [visit, setVisit] = useState<boolean>(false)
  const [subOrderId, setSubOrderId] = useState(null)
  const [orderVisible, setOrderVisible] = useState(false)
  const isPurchase = useLocation().pathname.includes('purchase')
  const ref=useRef()
  const columns:ProColumns<WithdrawPage>[]= [
        {
          title: '序号',
          dataIndex:'id',
          valueType: 'borderIndex',
          hideInSearch: true,
          valueType: 'indexBorder'
        },
        {
          title: '提现单号',
          dataIndex: 'sn',
          valueType: 'text',
        },
        {
          title: '提现类型',
          dataIndex: 'withdrawType',
          valueType: 'select',
          valueEnum: {
            'goodsAmount':'贷款提示',
            'commission':'收益',
          },
          hideInSearch: true
        },
        {
          title: '提现账户名',
          dataIndex: 'withdrawAccountName',
          valueType: 'text',
          hideInSearch: true,
        },
        {
          title: '提现银行卡',
          dataIndex: 'withdrawAccount',
          valueType: 'select',
          hideInSearch: true,
        },
        {
          title: '账户所属行',
          dataIndex: 'bankName',
          valueType: 'text',
          hideInSearch: true,
        },
        {
          title: '提现金额（元）',
          dataIndex: 'amount',
          valueType: 'text',
          hideInSearch: true,
          render:(_,data)=>{
            return <p>{amountTransform(_, '/')}元</p>
          }
        },
        {
          title: '提现手续费（元）',
          dataIndex: 'fee',
          valueType: 'text',
          hideInSearch: true,
          render:(_,data)=>{
            return <p>{amountTransform(_, '/')}元</p>
          }
        },
        {
          title: '提现时间',
          dataIndex: 'createTime',
          valueType: 'dateTimeRange',
          hideInTable: true,
        },
        {
          title: '提现时间',
          dataIndex: 'createTime',
          valueType: 'text',
          hideInSearch:true,
        },
        {
          title: '提现状态',
          dataIndex: 'status',
          valueType: 'select',
          hideInTable: true,
          valueEnum: {
            'auditing':'待审核',
            'waitPay':'待执行',
            'paid':'已执行',
            'arrived':'已到帐',
            'unPass':'审核拒绝', 
            'failure':'提现失败'
          },
        },
        {
          title: '提现状态',
          dataIndex: 'status',
          valueType: 'select',
          hideInSearch: true,
          valueEnum: {
            'auditing':'待审核',
            'waitPay':'待执行',
            'paid':'已执行',
            'arrived':'已到帐',
            'unPass':'审核拒绝', 
            'failure':'提现失败'
          },
        },
        {
          title: '交易流水号',
          dataIndex: 'voucher',
          valueType: 'text',
          hideInSearch: true,
        }
    ];
  const getFieldValue = (searchConfig) => {
    const {dateTimeRange,...rest}=searchConfig.form.getFieldsValue()
    return {
      startTime:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
      ...rest,
    }
  }
  return (
    <PageContainer>
        <ProTable<WithdrawPage>
          actionRef={ref}
          rowKey="id"
          options={false}
          request={withdrawPage}
          search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'queryIotConsumerOrderExport'}
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
              <ExportHistory key='task' show={visit} setShow={setVisit} type='queryIotConsumerOrderExport'/>,
          ],
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        {
        orderVisible &&
        <Detail
          id={subOrderId}
          visible={orderVisible}
          setVisible={setOrderVisible}
          isPurchase={isPurchase}
        />
      }
  </PageContainer>
  )
}