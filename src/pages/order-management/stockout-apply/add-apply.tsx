import { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { outStockApplyList } from '@/services/order-management/stockout-apply';
import { DrawerForm } from '@ant-design/pro-form';
import { amountTransform } from '@/utils/utils'
import { Form,Button,Image } from 'antd';
import type { ProColumns,ActionType } from '@ant-design/pro-table';
import GoosModel from './goos-model'


type activityItem={
  status: number;
  poNo: string;
  supplierId: number;
  operationId: number;
  goodsName: string;
  totalNum: number;
  createTime: string;
  wsId: string;
  supplierName: string;
  operationName: string;
  statusDesc: string;
}

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 14 },
  layout: {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  }
};


export default (props) => {
    const {visible,setVisible,onClose,callback}=props
    const ref=useRef<ActionType>()
    const [form] = Form.useForm();
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [goosList,setGoosList]=useState([])
    const columns:ProColumns<activityItem>[]= [
      {
        title: '采购单号',
        dataIndex: 'poNo',
        valueType: 'text',
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
        title: '集约活动ID',
        dataIndex: 'wsId',
        valueType: 'text',
        hideInTable: true
      },
      {
        title: '集约活动编号',
        dataIndex: 'wsId',
        valueType: 'text',
        hideInSearch: true
      },
      {
        title: '收货方',
        dataIndex: 'operationName',
      },
      {
        title: '采购商品',
        dataIndex: 'goodsName',
        render:(_,data)=>{
          return <div style={{display:'flex',alignItems:'center'}}> 
                  <Image src={data?.imageUrl} width={50} height={50} />
                  <div style={{marginLeft:'10px'}}>{_}</div>
                </div>
        }
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
        title: '采购总金额',
        dataIndex: 'totalPayment',
        valueType: 'text',
        hideInSearch: true,
        render: (_) => amountTransform(_, '/')
      },
      {
        title: '订单状态',
        dataIndex: 'supplierApplyStatus',
        valueType: 'select',
        hideInTable: true,
        valueEnum: {
          1: '待发货',
          2: '待收货',
        }
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        valueType: 'select',
        hideInSearch: true,
        valueEnum: {
          1: '待发货',
          2: '待收货',
          3: '待配送',
          4: '配送中',
          5: '已完成'
        }
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
    ];
    const onsubmit=()=>{
        setVisible(false)
        callback(true)
    }
    return (
        <DrawerForm
          title='新建申请'
          onVisibleChange={setVisible}
          visible={visible}
          width={1500}
          form={form}
          drawerProps={{
          forceRender: true,
          destroyOnClose: true,
          onClose: () => {
              onClose();
          }
          }}
          submitter={{
              render: (props, defaultDoms) => {
                  return [
                  ];
              },
          }}
          onFinish={async ()=>{
          await  onsubmit();
          }}
          {...formItemLayout}
        >
        <ProTable<activityItem>
          actionRef={ref}
          rowKey="poNo"
          options={false}
          headerTitle="数据列表"
          request={outStockApplyList}
          search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
          }}
          toolBarRender={() => [
            <Button key="3" type={goosList.length?'primary':'default'} style={{background:goosList.length?'':'#C6C6C6',color:'#fff'}} onClick={()=>{setFormVisible(true)}}>
              申请
            </Button>,
          ]}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
          rowSelection={{
            preserveSelectedRowKeys: true,
            onChange: (_, val) => {
             setGoosList(val)
            },
            // selectedRowKeys:keys
        }}
        />
        {formVisible&& <GoosModel
          visible={formVisible}
          setVisible={setFormVisible}
          goosList={goosList}
          callback={() => { ref.current&&ref.current.reload();setVisible(false);callback(true) }}
          onClose={() => { ref.current&&ref.current.reload(); }}
        />}
        </DrawerForm>
    );
  };
