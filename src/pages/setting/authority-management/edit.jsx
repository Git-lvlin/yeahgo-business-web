import React, { useEffect } from 'react';
import { Form, TreeSelect, message } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form';
import * as api from '@/services/setting/authority-management'

export default (props) => {
  const { visible, setVisible, callback, menuTree, pageTree, data } = props;
  const [form] = Form.useForm();
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
    return new Promise((resolve, reject) => {

      if (values.ruleType !== data.ruleType && data.children) {
        reject();
        message.error('该节点下还有子节点，不能修改类型');
        return;
      }

      if (values.pid === data.id) {
        reject();
        message.error('修改失败');
        return;
      }

      api.ruleEdit({
        id: data.id,
        title: values.title,
        url: values.url,
        ruleType: values.ruleType,
        // status: values.status ?? 1,
        pid: values.pid || 0,
        authOpen: values.authOpen ?? 1,
      }, { showSuccess: true, showError: true }).then(res => {
        if (res.code === 0) {
          resolve();
        } else {
          reject();
        }
      })
    });
  }

  const onValuesChange = (e) => {
    if (!e.ruleType) {
      return;
    }
    let pid = '';

    if (data.ruleType === 3 && e.ruleType !== 3) {
      pid = '';
    } else {
      pid = data.pid || '';
    }

    if (data.ruleType !== 3 && e.ruleType === 3) {
      pid = '';
    }
    if (data.ruleType !== 3 && e.ruleType !== 3) {
      pid = data.pid || '';
    }

    form?.setFieldsValue({
      pid,
    })

  }

  useEffect(() => {
    form?.setFieldsValue({
      url: data.url,
      ruleType: data.ruleType,
      title: data.title,
      authOpen: data.authOpen,
      pid: data.pid || '',
    })
  }, [data])

  return (
    <ModalForm
      title="编辑权限"
      modalProps={{
        onCancel: () => form.resetFields(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        form.resetFields();
        callback();
        return true;
      }}
      onValuesChange={onValuesChange}
      {...formItemLayout}
    // initialValues={{
    //   ruleType: data.rule_type,
    //   status: data.status,
    //   title: data.title,
    //   name: data.name
    // }}
    >
      <ProFormRadio.Group
        options={[
          {
            value: 1,
            label: '菜单',
          },
          {
            value: 2,
            label: '页面',
          },
          {
            value: 3,
            label: '按钮',
          },
        ]}
        width="md"
        name="ruleType"
        label="类型"
      />

      <ProFormRadio.Group
        options={[
          {
            value: 1,
            label: '公开',
          },
          {
            value: 0,
            label: '不公开',
          },
        ]}
        width="md"
        name="authOpen"
        label="状态"
        hidden
      />

      <ProFormText
        label="名称"
        width="md"
        rules={[{ required: true, message: '请输入名称！' }]}
        name="title"
      />

      <ProFormText
        name="url"
        label="URL"
        width="md"
        rules={[{ required: true, message: '请输入URL！' }]}
      />

      <ProFormDependency name={['ruleType']}>
        {({ ruleType }) => {
          return ruleType !== 3 && <Form.Item label={`所属菜单`} rules={[{ required: ruleType === 2, message: '请选择所属菜单！' }]} name="pid">
            <TreeSelect
              style={{ width: 328 }}
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={menuTree}
              placeholder="请选择"
            />
          </Form.Item>
        }}
      </ProFormDependency>

      <ProFormDependency name={['ruleType']}>
        {({ ruleType }) => {
          return ruleType === 3 && <Form.Item label="所属页面" rules={[{ required: true, message: '请选择所属页面！' }]} name="pid">
            <TreeSelect
              style={{ width: 328 }}
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={pageTree}
              placeholder="请选择"
            />
          </Form.Item>
        }}
      </ProFormDependency>
    </ModalForm >
  );
};