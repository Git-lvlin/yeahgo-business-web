import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-form'
import { Button, message, Space } from 'antd'
import { history } from 'umi'
import md5 from 'blueimp-md5'

import styles from './styles.less'
import { accountManagement, apply } from '@/services/financial-management/account-management'
import { amountTransform } from '@/utils/utils'

const AccountManagement = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [change, setChange] = useState(1)

  const skipToSetting = (flag) => {
    if(flag) message.error('请先设置交易密码')
    history.push(`/setting/trade-password`)
  }

  const WithdrawalModal = ({ val, change, update }) => {

    const withdrawal = (v) => {
      const money = amountTransform(v.amount, '*')
      const { payPassword } = v
      apply({
        amount: money,
        payPassword: md5(payPassword)
      }).then(res=> {
        if(res?.success){
          update(change + 1)
          message.success('提现成功')
        }
      })
    }
    return (
      <ModalForm
        title="提现"
        layout='horizontal'
        width={500}
        trigger={
          <Button type='primary'>提现</Button>
        }
        modalProps={{
          destroyOnClose: true
        }}
        onFinish={async (values) => {
          await withdrawal(values)
          return true
        }}
      >
        <Space align="baseline">
          <ProFormDigit
            label="提现金额"
            name="amount"
            rules={[{required: true }]}
            width="md"
          />
          <span>元</span>
        </Space>
        <ProFormText.Password
          name="payPassword"
          label="交易密码"
          rules={[{required: true }]}
          width="md"
          fieldProps={{
            autoComplete: 'new-password'
          }}
        />
        <div className={styles.setPassword}>
          <a onClick={()=>{skipToSetting(false)}}>忘记密码？</a>
        </div>
        <ProFormText
          name="realName"
          label="提现账户名"
          initialValue={val?.realname}
          readonly
        />
        <ProFormText
          name="cardNo"
          initialValue={val?.cardNo}
          label="提现账号"
          readonly
        />
        <ProFormText
          name="bankName"
          label="所属银行"
          initialValue={val?.bankName}
          readonly
        />
        <ProFormText
          name="balanceAvailable"
          label="可提现金额"
          initialValue={`￥${amountTransform(Number(val?.balanceAvailable), '/')}`}
          readonly
        />
      </ModalForm>
    )
  }

  useEffect(() => {
    setLoading(true)
    accountManagement().then(res => {
      if (res.success) {
        setData(res?.data)
      }
    }).finally(() => {
      setLoading(false)
    })
    return () => {
      setData({})
    }
  }, [change])
  return (
    <PageContainer title={false}>
      <ProCard gutter={[24, 24]}>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          title='供应商虚拟子账户'
          loading={loading}
        >
          <div className={styles.withdrawal}>
            {
              data?.cardNo &&
              (data?.isSetPassword ?
              <WithdrawalModal
                val={data}
                update={setChange}
                change={change}
              />:
              <Button type='primary' onClick={()=>{skipToSetting(true)}}>提现</Button>)
            }
          </div>
          <div className={styles.platform}>
            <div>账户号码： </div>
            <div><span className={styles.sn}>{data?.sn}</span></div>
            <div className={styles.balance}>
              <div>
                余额： <span>{amountTransform(Number(data?.balance), '/')}</span>
              </div>
              <Button
                onClick={() => { history.push('/financial-management/transaction-details') }}
              >
                交易明细
              </Button>
            </div>
            <div className={styles.balance}>
              <Space size="middle">
                <div>
                  可提现余额：<span>{amountTransform(Number(data?.balanceAvailable), '/')}</span>
                </div>
                <Button
                  onClick={() => { history.push('/financial-management/transaction-details?amountType=available') }}
                >
                  交易明细
                </Button>
              </Space>
              <Space>
                <div>
                  冻结余额： <span>{amountTransform(Number(data?.balanceFreeze), '/')}</span>
                </div>
                <Button
                  onClick={() => { history.push('/financial-management/transaction-details?amountType=freeze') }}
                >
                  交易明细
                </Button>
              </Space>
            </div>
          </div>
        </ProCard>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          title='供应商银行账户'
          loading={loading}
        >
          <div className={styles.bindCard}>
            <div>账户名称： <span>{data?.realname}</span></div>
            <div>账户号码： <span>{data?.cardNo}</span></div>
            <div>开户银行： <span>{data?.bankName}</span></div>
          </div>
        </ProCard>
      </ProCard>
    </PageContainer>
  )
}

export default AccountManagement
