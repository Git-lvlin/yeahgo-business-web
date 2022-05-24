import { useEffect,useState,useRef } from 'react';
import { Form,Image,message } from 'antd';
import {
  ModalForm,
} from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { refundCreate } from '@/services/order-management/stockout-apply';

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


export default (props) => {
  const { visible, setVisible,onClose,goosList,callback} = props;
  const [dataSource, setDataSource] = useState([]);
  const [editableKeys, setEditableKeys] = useState([])
  const [form] = Form.useForm();
  const actionRef = useRef();
  const formRef = useRef();
  useEffect(()=>{
    setEditableKeys(goosList?.map(item => item.poNo))
  },[])
  const columns:ProColumns<activityItem>[] = [
    {
      title: '采购单号',
      dataIndex: 'poNo',
      valueType: 'text',
      editable: false,
    },
    {
      title: '集约活动ID',
      dataIndex: 'wsId',
      valueType: 'text',
      editable: false,
    },
    {
      title: '收货方',
      dataIndex: 'operationName',
      editable: false,
    },
    {
      title: '采购商品',
      dataIndex: 'goodsName',
      editable: false,
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
      editable: false,
    },
    {
      title: '采购数量',
      dataIndex: 'totalNum',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
    },
    {
      title: '缺货数量',
      dataIndex: 'returnNum',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入缺货数量',
      },
      fixed: 'right'
    }
  ];
  return (
    <ModalForm
      title='申请提交'
      onVisibleChange={setVisible}
      visible={visible}
      width={1000}
      form={form}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: () => {
          onClose();
        }
      }}
      submitter={{
        searchConfig: {
          submitText: '确认提交',
          resetText: '取消'
        }
      }}
      {...formItemLayout}
      onFinish={async (values) => {
        if(goosList.length==0){
          return message.error('请选择订单数据！')
        }
        refundCreate({refundData:dataSource}).then(res=>{
          if(res.code==0){
            setVisible(false)
            callback(true)
          }
        })
      }} 
    >
      <EditableProTable
        rowKey="poNo"
        options={false}
        actionRef={actionRef}
        formRef={formRef}
        value={goosList}
        recordCreatorProps={false}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        search={false}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onValuesChange: (record, recordList) => {
            setDataSource(recordList.map(ele => ({poNo:ele.poNo,skuId:ele.skuId,returnNum:ele.returnNum})))
          }
        }}
      />
    </ModalForm >
  );
};