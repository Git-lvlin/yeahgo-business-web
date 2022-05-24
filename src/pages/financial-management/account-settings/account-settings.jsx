import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { ModalForm, ProFormText, ProFormCaptcha, ProFormRadio, ProFormSelect } from '@ant-design/pro-form'
import { Button, message } from 'antd'

import { query, unbind, bind, unBindSendSms, findAllBanks } from '@/services/financial-management/account-management'
import styles from './styles.less'

const { Group } = ProFormRadio

const PopUnbind = ({data})=> {
  const unBindAccount = ()=> {
    unBindSendSms().then(res=> {
      res?.success && message.success('验证码发送成功!')
    })
  }
  return(
    <>
      <ProFormText
        name="mobile"
        initialValue={data?.mobile}
        label="手机"
        width="md"
        readonly
      />
      <ProFormCaptcha
        name="verifyCode"
        label="验证码"
        rules={[
          {
            required: true,
            message: '请输入验证码',
          },
        ]}
        placeholder="请输入验证码"
        onGetCaptcha={async ()=> {
          await unBindAccount()
        }}
      />
    </>
  )
}

const PopBind = ({data, bankList})=> {
  return(
    <>
      <ProFormText
        name="cardName"
        initialValue={data?.subject}
        label="商家主体名称"
        width="md"
        readonly
      />
      <p className={styles.txt}>对公账户的绑定仅支持此商家主体名下银行账户，对私账户的绑定仅支持此商家主体法人代表名下的银行账户</p>
      <Group
        name="bankAcctType"
        label="账户性质"
        rules={[
          {
            required: true,
            message: '请选择账户性质'
          }
        ]}
         options={[
           {
             label: '公司户',
             value: 'business',
           },
           {
             label: '个人户',
             value: 'person',
           }
         ]}
      />
      <ProFormText
        width="md"
        name="realname"
        label="账户名称"
        rules={[
          {
            required: true,
            message: '请输入账户名称',
          }
        ]}
        placeholder="请输入账户名称"
      />
      <ProFormSelect
        width="md"
        label="开户银行"
        name="bankName"
        options={bankList?.map(item => (
          {label: item.bankName, value: item.bankCode}
        ))}
        rules={[
          {
            required: true,
            message: '请选择开户银行',
          }
        ]}
      />
      <ProFormText
        width="md"
        name="cardNo"
        label="账户号码"
        rules={[
          {
            required: true,
            message: '请输入账户号码',
          }
        ]}
        placeholder="请输入账户号码"
      />
    </>
  )
}

const PopModal = ({val, change, num})=> {
  const [bankList, setBankList] = useState([])
  useEffect(()=> {
    findAllBanks().then(res=> {
      if(res?.success) setBankList(res?.data)
    })
    return ()=> {
      setBankList([])
    }
  },[])
  const btnContent = ()=> {
    if(val?.id) {
      return '验证码'
    } else {
      return '帐户绑定'
    }
  }

  const btnText = ()=> {
    if(val?.id) {
      return '解绑'
    } else {
      return '用户绑定'
    }
  }

  const submitCode = (v)=> {
    if(val?.id) {
      unbind({id: val?.id, ...v}).then(res=> {
        if(res?.success) {
          change(num + 1)
          message.success('提交成功')
        }
      })
    } else {
      const bankObj = bankList.filter(item=> item.bankCode === v.bankName)[0]
      bind({
        ...v,
        bankCode: bankObj.bankCode,
        bankName: bankObj.bankName
      }).then(res=> {
        if(res?.success) {
          change(num + 1)
          message.success('提交成功')
        }
      })
    }
  }
  return (
    <ModalForm
      title={btnContent()}
      layout='horizontal'
      width={val?.id ? 500 : 650}
      trigger={
        <Button type="default">{btnText()}</Button>
      }
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        await submitCode(values)
        return true
      }}
    >
      {
        val?.id ? <PopUnbind data={val}/>: 
        <PopBind data={val} bankList={bankList}/>
      }
    </ModalForm>
  )
}

const AccountSettings = ()=> {
  const [accountData, setAccountData] = useState('')
  const [change, setChange] = useState(1)
  const [flag, setFlag] = useState(false)
  useEffect(()=>{
    setFlag(true)
    query().then(res=> {
      if(res?.success) setAccountData(res?.data)
    }).finally(()=> {
      setFlag(false)
    })
    return ()=> {
      setAccountData('')
    }
  }, [change])

  return (
    <PageContainer title={false}>
      <ProCard 
        colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
        bordered
        title='供应商银行账户'
        loading={flag}
      >
        <div className={styles.withdrawal}>
          <PopModal val={accountData} change={setChange} num={change}/>
        </div>
        <div className={styles.platform}>
          <div className={styles.balance}>
            <div>
              账户名称：<span>{accountData?.cardName}</span>
            </div>
          </div>
          <div className={styles.balance}>
            <div>
              账户号码：<span>{accountData?.cardNo}</span>
            </div>
          </div>
          <div className={styles.balance}>
            <div>
              开户银行：<span>{accountData?.bankName}</span>
            </div>
          </div>
        </div>
      </ProCard>
    </PageContainer>
  )
}

export default AccountSettings
