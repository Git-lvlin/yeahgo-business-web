import { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { refundList } from '@/services/order-management/stockout-apply';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns,ActionType } from '@ant-design/pro-table';
import { Button } from 'antd';
import AddApply from './add-apply'
import StockoutDetail from './stockout-detail'
import Detail from '../intensive-purchase-order/detail';


type activityItem={
  unit: string;
  orSn: string;
  poNo: string;
  wsId: number;
  goodsName: string;
  totalNum: number;
  returnNum: number;
  createTime: string;
}

export default ()=> {
    const ref=useRef<ActionType>()
    const [visible, setVisible] = useState<boolean>(false);
    const [detailVisible,setDetailVisible]=useState<boolean>(false)
    const [poNoVisible,setPoNoVisible]=useState<boolean>(false)
    const [selectItem, setSelectItem] = useState();
    const [pennyId,setPennyId]=useState()
    const columns:ProColumns<activityItem>[]= [
      {
        title: '申请编号',
        dataIndex: 'orSn',
        valueType: 'text',
        hideInTable: true
      },
      {
        title: '缺货单编号',
        dataIndex: 'orSn',
        valueType: 'text',
        hideInSearch: true
      },
      {
        title: '关联集约采购单号',
        dataIndex: 'poNo',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <a onClick={()=>{setSelectItem(data); setPoNoVisible(true);}}>{_}</a>
        }
      },
      {
        title: '集约活动编号',
        dataIndex: 'wsId',
        valueType: 'text',
      },
      {
        title: '集约采购单号',
        dataIndex: 'poNo',
        valueType: 'text',
        hideInTable:true
      },
      {
        title: '采购商品',
        dataIndex: 'goodsName',
        valueType: 'text',
      },
      {
        title: '库存单位',
        dataIndex: 'unit',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '采购数量',
        dataIndex: 'totalNum',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '缺货数量',
        dataIndex: 'returnNum',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '申请时间',
        dataIndex: 'dateTimeRange',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '申请时间',
        dataIndex: 'createTime',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
          <a onClick={()=>{setDetailVisible(true);setPennyId({orSn:record?.orSn,supplierId:record?.supplierId})}}>查看详情</a>
        ],
      }, 
    ];
    return (
      <PageContainer title=" ">
        <div style={{background:'#fff',padding:'20px'}}>
          <Button onClick={()=>{setVisible(true)}} key="button" type="primary">新建申请</Button>
        </div>
        <ProTable<activityItem>
          actionRef={ref}
          rowKey="id"
          options={false}
          headerTitle="数据列表"
          request={refundList}
          search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse()
          ],
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        {detailVisible&& <StockoutDetail
          visible={detailVisible}
          setVisible={setDetailVisible}
          record={pennyId} 
          callback={() => { ref.current&&ref.current.reload(); setPennyId(NaN) }}
          onClose={() => { ref.current&&ref.current.reload(); setPennyId(NaN) }}
        />} 
        {visible&& <AddApply
          visible={visible}
          setVisible={setVisible}
          callback={() => { ref.current&&ref.current.reload(); }}
          onClose={() => { ref.current&&ref.current.reload();}}
        />}
        {poNoVisible &&<Detail
          id={selectItem?.poNo}
          visible={poNoVisible}
          setVisible={setPoNoVisible}
          callback={() => {
            setPoNoVisible(false);
            setSelectItem(null);
            ref.current.reload();
          }}
        />
      }
      </PageContainer>
    );
  };
