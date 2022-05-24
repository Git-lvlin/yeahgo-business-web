import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProForm, { ProFormSelect } from '@ant-design/pro-form'
import { 
  Button,
  message
} from 'antd'
import { history } from 'umi'

const ResetPassword = () => {

  const skipToSetPassword = (e) => {
    if(e) {
      history.push(`/setting/set-password?type=${e}`)
    } else {
      message.error('请选择重设密码的方式')
    }
  }

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
  }

  return (
    <PageContainer title={false}>
      <ProForm
        {...formItemLayout}
        style={{ backgroundColor: '#fff', padding: 30 }}
        submitter={{
          render: (props) => {
            return (
              <div style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={() => {skipToSetPassword(props.form.getFieldValue()?.choose)}}>下一步</Button>
              </div>
            )
          }
        }}
        layout='horizontal'
      >
        <ProFormSelect
          width="md"
          rules={[{ required: true, message: '请选择重设密码的方式' }]}
          request={async () => [
            { label: '通过原交易密码进行重设', value: 'oldpwd' },
            { label: '通过手机验证码进行重设', value: 'phone' }
          ]}
          name="choose"
          label="请选择重设密码的方式"
        />
      </ProForm>
    </PageContainer>
  )
}

export default ResetPassword
