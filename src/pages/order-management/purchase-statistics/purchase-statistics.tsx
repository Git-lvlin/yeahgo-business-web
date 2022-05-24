import { useState, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import type { ProColumns } from '@ant-design/pro-table'
import { Image, FormInstance } from 'antd'

import { statsProductOrderList } from '@/services/order-management/purchase-statistics'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'
import { getTimeDistance } from '@/utils/utils'
import type { TableListItem } from './data.d'

export default () => {
  const [visit, setVisit] = useState(false)

  const ref = useRef<FormInstance> ()

  const getFieldValue = () => {
    const { time, ...rest } = ref.current?.getFieldsValue()
    return {
      beginTime: time?.[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: time?.[1].format('YYYY-MM-DD HH:mm:ss'),
      ...rest
    }
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: '日期',
      dataIndex: 'time',
      hideInTable: true,
      valueType: 'dateTimeRange',
      initialValue: getTimeDistance('yesterday')
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      hideInSearch: true,
      width: '20%'
    },
    {
      title: '商品图片',
      dataIndex: 'imageUrl',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <Image src={r.imageUrl} width={80} height={80}/>
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '商品类型',
      dataIndex: 'businessType',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        0: '全部',
        1: '普适品',
        2: '精装生鲜',
        3: '毛菜'
      }
    },
    {
      title: '采购订单数',
      dataIndex: 'orderNums',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '规格/箱规',
      dataIndex: 'skuName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '份数',
      dataIndex: 'portion',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '总数量',
      dataIndex: 'totalNum',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '集约商家数',
      dataIndex: 'operationNums',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '统计类型',
      dataIndex: 'statsType',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        0: '统计全部订单',
        1: '统计集约结束待发货订单',
        2: '统计集约进行中订单'
      },
      hideInTable: true
    }
  ]

  return (
    <PageContainer>
      <ProTable
        rowKey='id'
        request={statsProductOrderList}
        params={{}}
        columns={columns}
        options={false}
        formRef={ref}
        search={{
          defaultCollapsed: false,
          optionRender:(searchConfig, formProps, dom)=>[
            <Export
              change={(e: boolean) => { setVisit(e) }}
              type="supplier-purchase-order-goods-stats-export"
              conditions={getFieldValue}
              key='1'
            />,
            <ExportHistory 
              show={visit}
              setShow={setVisit}
              type="supplier-purchase-order-goods-stats-export" 
              key='2'
            />,
            ...dom.reverse()
          ]
        }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
      />
    </PageContainer>
  )
}
