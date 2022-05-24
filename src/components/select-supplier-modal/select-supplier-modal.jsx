import React, { useState } from 'react';
import {
  ModalForm,
} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { manageSupplierList } from '@/services/product-management/product-list'

export default (props) => {
  const { visible, setVisible, callback } = props;
  const [selectItems, setSelectItems] = useState(null);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  const columns = [
    {
      title: '供应商家名称',
      dataIndex: 'companyName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入供应商家名称'
      }
    },
    {
      title: '登录账号',
      dataIndex: 'accountName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入登录账号'
      }
    },
    {
      title: '负责人',
      dataIndex: 'companyUserName',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => `${_} ${data.companyUserPhone}`
    },
  ];

  return (
    <ModalForm
      title={`选择供应商家`}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={1200}
      onFinish={() => {
        callback(selectItems);
        return true;
      }}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProTable
        columns={columns}
        rowKey="supplierId"
        options={false}
        request={manageSupplierList}
        search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        pagination={{
          pageSize: 10,
        }}
        recordCreatorProps={false}
        tableAlertRender={false}
        rowSelection={{
          hideSelectAll: true,
          type: 'radio',
          onChange: (_, val) => {
            setSelectItems(val[0])
          }
        }}
      />
    </ModalForm>
  );
};