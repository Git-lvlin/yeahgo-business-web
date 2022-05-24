import React, { useEffect, useState } from 'react'
import {
  Button,
  Space,
  Typography,
  Empty
} from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import ProForm, { ProFormText, ProFormDependency } from '@ant-design/pro-form'
import md5 from 'blueimp-md5'
import { history } from 'umi'
import { CheckCircleOutlined } from '@ant-design/icons'

import { accountManagement } from '@/services/financial-management/account-management'
import { updatePwd } from '@/services/setting/trade-password'

const { Paragraph, Title } = Typography

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  layout: {
    labelCol: {
      span: 10
    },
    wrapperCol: {
      span: 12
    }
  }
}

const skipToResetPassword = () => {
  history.push('/setting/reset-password')
}

const IsSetPwd = ({ isSetPassword }) => {
  if (!isSetPassword) {
    return (
      <>
        <ProForm
          {...formItemLayout}
          style={{ backgroundColor: '#fff', padding: 30 }}
          submitter={{
            render: (props) => {
              return (
                <div style={{ textAlign: 'center' }}>
                  <Space>
                    <Button type="primary" key="submit" onClick={()=> props.form?.submit?.()}>
                      确定
                    </Button>
                    <Button key="goBack" onClick={()=> history.goBack()}>
                      取消
                    </Button>
                  </Space>
                </div>
              )
              
            }
          }}
          onFinish={(values) => {
            const { payPassword } = values
            updatePwd({
              payPassword: md5(payPassword)
            }, { showSuccess: true }).then(res => {
              if (res.success) {
                window.location.reload()
              }
            })
          }}
        >
          <ProFormText.Password
            name="payPassword"
            label={`新密码`}
            placeholder="请输入6-18位的交易密码"
            fieldProps={{
              visibilityToggle: false,
              autoComplete: 'new-password'
            }}
            validateFirst
            rules={[
              { required: true, message: '请输入当前的交易密码' },
              { required: true, message: '密码应不少于6个字符，不超过18个字符', min: 6, max: 18 }
            ]}
            width="md"
          />
          <ProFormDependency name={['payPassword']}>
            {({ payPassword }) => (
              <ProFormText.Password
                name="newPwd"
                label={`确认新密码`}
                placeholder="请再次输入新的交易密码"
                validateFirst
                fieldProps={{
                  visibilityToggle: false,
                  autoComplete: 'new-password'
                }}
                width="md"
                rules={[
                  { required: true, message: '请再次输入交易密码' },
                  () => ({
                    validator(_, value) {
                      if (payPassword === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  })
                ]}
              />
            )}
          </ProFormDependency>
        </ProForm>
        <Typography style={{ background: '#fff', padding: 20 }}>
          <Title level={5}>密码设置规则：</Title>
          <Paragraph>
            <ol>
              <li>密码位数为6-18个字符，不允许有空格，区分大小写。</li>
              <li>支持字母（a-z，A-Z）、数字（0-9）及“_~@#$^”符号</li>
              <li>密码需使用大写字母、小写字母、数字及特殊字符（_~@#$^）中至少二种以上的组合</li>
            </ol>
          </Paragraph>
        </Typography>
      </>
    )
  } else {
    return (
      <Empty
        style={{
          background: '#fff',
          height: 'calc(100vh - 150px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
        image={<CheckCircleOutlined />}
        imageStyle={{
          fontSize: 60,
          color: '#00ffcc'
        }}
        description={
          <h2>交易密码已经设置成功</h2>
        }
      >
        <Button type="primary" onClick={()=> { skipToResetPassword() }}>重新设置密码</Button>
      </Empty>
    )
  }
}

const TradePassword = () => {
  const [isSetPassword, setIsSetPassword] = useState(false)

  useEffect(() => {
    accountManagement().then(res => {
      setIsSetPassword(res.data.isSetPassword)
    })
  }, [])

  return (
    <PageContainer title={false}>
      <IsSetPwd isSetPassword={isSetPassword}/>
    </PageContainer>
  )
}

export default TradePassword
