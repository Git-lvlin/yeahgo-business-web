import React, { useState, useEffect } from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form';
import md5 from 'blueimp-md5'
import { Form } from 'antd';

import { adminAdd, adminEdit } from '@/services/setting/account-management'

export default (props) => {
  const { visible, setVisible, adminGroupList, callback, onClose, data } = props;
  const [form] = Form.useForm()

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

  const submit = (values) => {
    const apiMethod = data ? adminEdit : adminAdd;
    const { password2, accountName2, ...rest } = values;
    const obj = { ...rest };
    if (data) {
      obj.id = data.id;
    }
    if (password2) {
      obj.password = md5(password2)
    }
    obj.accountName = accountName2;
    return apiMethod(obj, { showSuccess: true })
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        roleId: data.roleId,
        accountName2: data.accountName,
        nickname: data.nickname,
        status: data.status
      });
    }
  }, [data, form])

  return (
    <ModalForm
      title={`${data ? '编辑' : '新建'}账号`}
      modalProps={{
        onCancel: () => onClose(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={async (values) => {
        await submit(values);
        callback();
        return true;
      }}
      form={form}
      labelAlign="right"
      {...formItemLayout}
      initialValues={{
        status: 1,
      }}
    >
      <ProFormText
        name="nickname"
        label="名称"
        placeholder="请输入名称"
        width="md"
        rules={[{ required: true, message: '请输入名称' }]}
        disabled={!!data}
      />

      <ProFormText
        name="accountName2"
        label="登录账号"
        placeholder="请输入登录账号"
        width="md"
        rules={[{ required: true, message: '请输入登录账号' }]}
        fieldProps={{
          visibilityToggle: false,
          autoComplete: 'off'
        }}
        disabled={!!data}
      />

      <ProFormText.Password
        name="password2"
        label="登录密码"
        placeholder="请输入登录密码"
        width="md"
        fieldProps={{
          visibilityToggle: false,
          autoComplete: 'new-password'
        }}
        validateFirst
        rules={[
          { required: !data, message: '请输入登录密码' },
          { required: !data, message: '密码应不少于6个字符，不超过18个字符', min: 6, max: 18 }
        ]}
      />

      <ProFormSelect
        options={adminGroupList}
        width="md"
        name="roleId"
        label="选择角色"
        rules={[{ required: true, message: '请选择角色' }]}
      />

      <ProFormRadio.Group
        required
        name="status"
        label="状态"
        options={[
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 0,
          },
        ]}
      />
    </ModalForm>
  );
};