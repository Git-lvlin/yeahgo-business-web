import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { shipAddrList,shipAddrDel } from '@/services/product-management/ship-address-management';
import ProForm,{ ModalForm,ProFormRadio,ProFormSwitch} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import Edit from './form';



export default () => {
    const ref=useRef()
    const [formVisible, setFormVisible] = useState(false);
    const [detailData, setDetailData] = useState(false)
    const shipAddrListDel=(record)=>{
        shipAddrDel({id:record?.id,supplierId:record?.supId},{ showSuccess: true }).then(res=>{
         if (res.code === 0) {
            ref.current.reload();
        }})
    }
    const columns= [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '姓名或地址',
        dataIndex: 'name',
        valueType: 'text',
        hideInTable: true,
      },
      {
        title: '名称',
        dataIndex: 'name',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '联系人姓名',
        dataIndex: 'contactName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '联系方式',
        dataIndex: 'contactPhone',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '地址',
        dataIndex: 'detailAddress',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
            <a onClick={() =>{
                setFormVisible(true) 
                setDetailData(record)
            }}>编辑</a>,
            <a onClick={()=>shipAddrListDel(record)}>删除</a>
        ],
      }, 
    ];
    return (
      <PageContainer>
        <ProTable
          actionRef={ref}
          rowKey="id"
          options={false}
          request={shipAddrList}
          search={{
            defaultCollapsed: false,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button icon={<PlusOutlined />}  onClick={() => { setFormVisible(true) }} type="primary">
                新增
            </Button>
            ],
        }} 
          columns={columns}
        />
         {formVisible && <Edit
            visible={formVisible}
            setVisible={setFormVisible}
            detailData={detailData}
            callback={() => { ref.current.reload();setDetailData(null) }}
            onClose={() => { ref.current.reload();setDetailData(null)}}
         />}
        </PageContainer>
    );
  };