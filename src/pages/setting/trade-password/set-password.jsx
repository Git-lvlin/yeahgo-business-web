import React, { useState, useEffect, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProForm, {
  ProFormText,
  ProFormDependency,
  StepsForm,
  ProFormCaptcha
} from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'
import md5 from 'blueimp-md5'
import {
  Form,
  Button,
  Space,
  Typography,
  message
} from 'antd'
import { history } from 'umi'

import { updatePwd, resetSendSms, verifyCode } from '@/services/setting/trade-password'
import { accountManagement } from '@/services/financial-management/account-management'
import { getPageQuery } from '@/utils/utils'

const { Paragraph, Title, Text } = Typography

const verify = ({ code }) => {
  return verifyCode({
    verifyCode: code
  }).then(res => {
    if (res.success) {
      return true
    } else {
      return false
    }
  })
}

const setPassword = ({ code, payPassword }) => {
  const pwd = md5(payPassword)
  return updatePwd({
    payPassword: pwd,
    verifyCode: code
  }).then(res=> {
    if(res.success) {
      message.success('密码修改成功')
      history.push('/setting/trade-password')
      return true
    } else {
      return false
    }
  })
}

const Choose = () => {
  const [form] = Form.useForm()
  const formRef = useRef()
  const [userPhone, setUserPhone] = useState('')

  useEffect(() => {
    accountManagement().then(res => {
      setUserPhone(res.data?.mobile)
    })
    return () => {
      setUserPhone('')
    }
  }, [])

  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
    layout: {
      labelCol: {
        span: 10
      },
      wrapperCol: {
        span: 12
      },
    }
  }

  if (getPageQuery()?.type === 'oldpwd') {
    return (
      <>
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
            const { oldPayPassword, payPassword } = values
            updatePwd({
              oldPayPassword: md5(oldPayPassword),
              payPassword: md5(payPassword)
            }, { showSuccess: true }).then(res => {
              if (res.success) {
                history.push('/setting/trade-password')
              }
            })
          }}
        >
          <ProFormText.Password
            name="oldPayPassword"
            label={`原密码`}
            placeholder="请输入当前的交易密码"
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
          <ProFormText.Password
            name="payPassword"
            label={`新密码`}
            placeholder="请输入新的交易密码"
            fieldProps={{
              visibilityToggle: false,
              autoComplete: 'new-password'
            }}
            validateFirst
            rules={[
              { required: true, message: '请输入新的交易密码' },
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
                  { required: true, message: '请再次输入新的交易密码' },
                  () => ({
                    validator(_, value) {
                      if (payPassword === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'))
                    }
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
  } else if (getPageQuery()?.type === 'phone') {
    return (
      <ProCard>
        <StepsForm
          formRef={formRef}
          onFinish={async (values) => {
            return await setPassword(values)
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项'
            }
          }}
        >
          <StepsForm.StepForm
            name="base"
            title="验证身份"
            onFinish={async (values) => {
              return await verify(values)
            }}
          >
            <Typography>
              <Text>已绑定的手机号 {userPhone}</Text>
            </Typography>
            <ProFormCaptcha
              fieldProps={{
                size: 'large'
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`;
                }
                return '获取验证码';
              }}
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                resetSendSms().then(res => {
                  if (res.success) {
                    message.success('验证码发送成功')
                  }
                })
              }}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="setPwd"
            title="设置新交易密码"
            layout='horizontal'
            onFinish={async () => {
              return true
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
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="time"
            title="完成"
          />
        </StepsForm>
      </ProCard>
    )
  }
}

const SetPassword = () => {
  return (
    <PageContainer title={false}>
      <Choose />
    </PageContainer>
  )
}

export default SetPassword
