import React from 'react';
import { message, Form, TreeSelect, List, Button } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form';
import styles from './new-rule.less';
import * as api from '@/services/setting/authority-management'

const placeholderType = {
  1: {
    title: '请输入菜单名称',
    url: '请输入菜单URL'
  },
  2: {
    title: '请输入页面名称',
    url: '请输入页面URL'
  },
  3: {
    title: '请输入按钮名称',
    url: '请输入接口URL'
  }
}

export default (props) => {
  const { visible, setVisible, callback, menuTree, pageTree } = props;
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
    const arr = values.ruleItems.map(item => {
      return {
        ...item,
        ruleType: values.ruleType,
        status: values.status ?? 1,
        pid: (values.ruleType !== 3 ? values.menuId : values.pageId) ?? 0,
        authOpen: 1,
      }
    })

    return new Promise((resolve, reject) => {
      api.ruleAdd({ list: arr }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve();
        } else {
          reject();
        }
      })
    });
  }

  return (
    <DrawerForm
      title="新建权限"
      drawerProps={{
        onCancel: () => form.resetFields(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={850}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        form.resetFields();
        callback();
        return true;
      }}
      {...formItemLayout}
      initialValues={{
        ruleType: 1,
        status: 1,
        ruleItems: [{
          title: '',
          url: ''
        }]
      }}
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
            value: 2,
            label: '不公开',
          },
        ]}
        width="md"
        name="status"
        label="状态"
      />

      <ProFormDependency name={['ruleType']}>
        {({ ruleType }) => {
          return ruleType !== 3 && <Form.Item label={`所属菜单`} rules={[{ required: ruleType === 2, message: '请选择所属菜单！' }]} name="menuId">
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
          return ruleType === 3 && <Form.Item label="所属页面" rules={[{ required: true, message: '请选择所属页面！' }]} name="pageId">
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
      <ProFormDependency name={['ruleType']}>
        {({ ruleType }) => {
          return <Form.List name="ruleItems">
            {(fields, { add, remove }) => (
              <>
                <List
                  bordered
                  itemLayout="horizontal"
                >
                  {fields.map((field) => {
                    return (
                      <List.Item
                        extra={fields.length !== 1 &&
                          <Button style={{ marginLeft: 10, width: 80 }} onClick={() => { remove(field.name) }} type="primary" danger>
                            删除
                          </Button>}
                        key={field.key}
                        className={styles.list}
                      >
                        <ProFormText
                          {...field}
                          name={[field.name, 'title']}
                          fieldKey={[field.fieldKey, 'title']}
                          placeholder={placeholderType[ruleType].title}
                          rules={[{ required: true, message: placeholderType[ruleType].title }]}
                          fieldProps={{
                            style: {
                              width: 328
                            }
                          }}
                          key="1"
                        />
                        &nbsp;
                        <ProFormText
                          {...field}
                          name={[field.name, 'url']}
                          fieldKey={[field.fieldKey, 'url']}
                          placeholder={placeholderType[ruleType].url}
                          rules={[{ required: true, message: placeholderType[ruleType].url }]}
                          fieldProps={{
                            style: {
                              width: 328
                            }
                          }}
                          key="2"
                        />
                      </List.Item>
                    )
                  })}
                </List>
                <Button style={{ marginTop: 10 }} onClick={() => { add() }} type="primary">
                  添加更多
                </Button>
              </>
            )}
          </Form.List>
        }}
      </ProFormDependency >
    </DrawerForm >
  );
};