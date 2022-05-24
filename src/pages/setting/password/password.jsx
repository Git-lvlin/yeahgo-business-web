import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormText, ProFormDependency } from '@ant-design/pro-form';
import { changePwd } from '@/services/setting/password';
import md5 from 'blueimp-md5'
import { history } from 'umi';

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  layout: {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 12,
    },
  }
};

const Password = () => {
  const nikeName = window.localStorage.getItem('nickName');
  const accountName = window.localStorage.getItem('accountName');

  const [form] = Form.useForm();

  return (
    <PageContainer>
      <ProForm
        {...formItemLayout}
        form={form}
        style={{ backgroundColor: '#fff', padding: 30 }}
        submitter={{
          render: (props, doms) => {
            return <div style={{ textAlign: 'center' }}>
              <Space>
                <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                  确定
                </Button>
                <Button key="goBack" onClick={() => history.goBack()}>
                  取消
                </Button>
              </Space>
            </div>
          }
        }}
        onFinish={(values) => {
          const { oldPwd, newPwd } = values;
          changePwd({
            oldPwd: md5(oldPwd),
            newPwd: md5(newPwd)
          }, { showSuccess: true }).then(res => {
            if (res.code === 0) {
              history.goBack();
            }
          })
        }}
      >
        <Form.Item
          label="商家名称"
        >
          {nikeName}
        </Form.Item>
        <Form.Item
          label="登录账户"
        >
          {accountName}
        </Form.Item>
        <ProFormText.Password
          name="oldPwd"
          label={`原密码`}
          placeholder="请输入当前的登录密码"
          fieldProps={{
            visibilityToggle: false,
            autoComplete: 'new-password'
          }}
          validateFirst
          rules={[
            { required: true, message: '请输入当前的登录密码' },
            { required: true, message: '密码应不少于6个字符，不超过18个字符', min: 6, max: 18 }
          ]}
          width="md"
        />
        <ProFormText.Password
          name="password"
          label={`新密码`}
          placeholder="请输入新的登录密码"
          fieldProps={{
            visibilityToggle: false,
            autoComplete: 'new-password'
          }}
          validateFirst
          rules={[
            { required: true, message: '请输入新的登录密码' },
            { required: true, message: '密码应不少于6个字符，不超过18个字符', min: 6, max: 18 }
          ]}
          width="md"
        />
        <ProFormDependency name={['password']}>
          {({ password }) => (
            <ProFormText.Password
              name="newPwd"
              label={`确认新密码`}
              placeholder="请再次输入新的登录密码"
              validateFirst
              fieldProps={{
                visibilityToggle: false,
                autoComplete: 'new-password'
              }}
              width="md"
              rules={[
                { required: true, message: '请再次输入新的登录密码' },
                () => ({
                  validator(_, value) {
                    if (password === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                })
              ]}
            />
          )}
        </ProFormDependency>
      </ProForm>
    </PageContainer>
  );
};

export default Password;
