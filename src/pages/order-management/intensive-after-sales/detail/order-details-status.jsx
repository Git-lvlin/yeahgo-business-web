import React, {useRef} from 'react'
import { Button, message, Space } from 'antd'
import ProForm, {
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form'

import { amountTransform } from '@/utils/utils'
import { 
  agreeApply,
  refuseApply,
  agreePayment,
  refusePayment,
  storeEvidence
} from '@/services/order-management/intensive-after-sales'
import Upload from '@/components/upload'

import styles from './styles.less'

const ShowState = ({status}) => {
  switch(status) {
    case 1:
      return '待审核'
    case 2:
      return '处理中'
    case 3:
      return '已拒绝'
    case 4:
      return '已完成'
    case 5:
      return '已关闭'
    default:
      return ''
  }
}

const ModalTextArea = () => {
  return(
    <>
      <div style={{marginBottom: 20}}>
        <ProFormTextArea
          label="拒绝原因"
          name="description"
          rules={[
            {
              required: true,
              message: '请输入拒绝原因'
            }
          ]}
          fieldProps={{
            showCount: true,
            maxLength: 200
          }}
        />
      </div>
      <ProForm.Item
        label="上传凭证"
        name="voucherPics"
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小1MB以内</dd>
            <dd>2.图片格式png/jpg/gif</dd>
          </dl>
        }
      >
        <Upload
          code={219}
          multiple 
          maxCount={3}
          accept="image/*" 
          size={1 * 1024} 
        />
      </ProForm.Item>
    </>
  )
}

const AfterState = ({data}) => {
  return (
    <div className={styles.detailTitle}>
      <div>
        <ShowState status={data?.status}/>
        {
          data?.isPlatIntervention === 1 &&
          <span className={styles.isIntervention}>平台已介入</span>
        }
        {
          (data?.refundStatus === 4 && data?.status === 2) && 
          <div className={styles.status}>待退款</div>
        }
        {
          (data?.refundStatus === 3 && data?.status === 2) &&
          <div className={styles.status}>待退货</div>
        }
         {
          (data?.refundStatus === 6 && data?.status === 2) &&
          <div className={styles.status}>退款中</div>
        }
      </div>
    </div>
  )
}

const argeeModalContent = (data, address) => (
  <>
    {
      (data?.status === 1 && address?.length !== 0)&&
      <p style={{textAlign: 'center'}}>确认处理本次售后退款申请吗？</p>
    }
    {
      (data?.status === 1 && address?.length === 0)&&
      <p style={{textAlign: 'center'}}>请先设置您的售后地址</p>
    }
    {
      (data?.refundStatus === 3 && data?.status === 2) &&
      <p style={{textAlign: 'center'}}>请等待买家退货后再操作</p>
    }
    {
      (data?.refundStatus === 6 && data?.status === 2) &&
      <p style={{textAlign: 'center'}}>正在退款中请稍后再操作</p>
    }
    {
      (data?.status === 2 && data?.refundStatus === 4) &&
      <p style={{textAlign: 'center'}}>
        退货总金额: &nbsp;&nbsp;
        <span style={{color:'red', fontSize: 16}}>
          ¥{amountTransform(data?.goodsRefundAmount, '/').toFixed(2)}
        </span>
      </p>
    }
    {(data?.status === 3 && data?.isPlatIntervention === 1) && <ModalTextArea />}
  </>
)
const disargeeModalContent = (data) => {
  if(data?.refundStatus === 3 && data?.status === 2){
    return <p style={{textAlign: 'center'}}>请等待买家退货后再操作</p>
  } else if(data?.refundStatus === 6 && data?.status === 2){
    return <p style={{textAlign: 'center'}}>正在退款中请稍后再操作</p>
  } else {
    return <ModalTextArea />
  }
}

const OrderDetailStatus = props => {
  const { 
    data,
    change,
    address,
    currentArr,
    defaultAddr,
  } = props
  const disBtn = () => {
    const flag = (data?.status === 3) && data?.isShowVoucher === 0
    if(flag){
      return true
    } else {
      return false
    }
  }
  const formRef = useRef()
  const agreeSubmit = async (values) => {
    let {voucherPics} = values
    voucherPics =  await Array.isArray(voucherPics) ? voucherPics.join(',') : voucherPics
    if(data?.status === 1 && address?.length !== 0) {
      await agreeApply({
        refundId: data?.refundId,
        addressId: currentArr
        ? currentArr?.companyAddressId
        : defaultAddr[0]?.id
      }).then(res => {
        if(res?.success){
          change(true)
          message.success('提交成功')
          return true
        }
      })
    } else if(data?.status === 2 && data?.refundStatus === 4) {
      agreePayment({refundId: data?.refundId}).then(res => {
        if(res.success){
          change(true)
          message.success('提交成功')
          return true
        }
      })
    } else if((data?.status === 3) && data?.isPlatIntervention === 1){
      storeEvidence(
        {
          refundId: data?.refundId,
          description: values?.description,
          voucherPics
        }).then(res => {
        if(res.success){
          change(true)
          message.success('提交成功')
          return true
        }
      })
    }
    return true
  }
  const disagreeSubmit = async (values) => {
    let {voucherPics} = values
    voucherPics =  Array.isArray(voucherPics) ? voucherPics.join(',') : voucherPics
    if(data?.status === 1) {
      await refuseApply({
        refundId: data?.refundId,
        ...values,
        voucherPics
      }).then(res => {
        if(res.success){
          change(true)
          message.success('提交成功')
          return true
        }
      })
    } else if(data?.status === 2 && data?.refundStatus === 4) {
      await refusePayment({
        refundId: data?.refundId,
        ...values,
        voucherPics
      }).then(res => {
        if(res.success){
          change(true)
          message.success('提交成功')
          return true
        }
      })
    } else if(data?.status === 3 && data?.isIntervention === 1){
      storeEvidence({id: data?.arbitrationInfo?.id, storeEvidence: values?.handleNote, storeEvidenceImg: handleImageUrl}).then(res => {
        if(res.success){
          change(true)
          message.success('提交成功')
          return true
        }
      })
    }
    return true
  }

  const argeeContent = (status) => {
    switch(status){
      case 1:
        return '同意申请'
      case 2:
        return '同意退款'
      case 3:
        if(data?.isPlatIntervention === 1 && data?.isShowVoucher === 1){
          return '提交举证信息'
        } else if(data?.isShowVoucher === 0){
          return '已提交举证信息'
        }
        break
      default:
        return ''
    }
  }

  const disargeeContent = (status) => {
    switch(status){
      case 1:
      return '拒绝申请'
      case 2:
      return '拒绝退款'
      default:
        return ''
    }
  }

  return (
    <div className={styles.orderDetailStatus}>
      <div>
        <div className={styles.detailTag}>
          售后单号
          <span>{data?.orderId}</span>
        </div>
        <AfterState data={data}/>
      </div>
      <div className={styles.submit}>
        <Space size='large'>
          <ModalForm
            layout="inline"
            title={disargeeContent(data?.status)}
            width={(data?.refundStatus === 1 || data?.refundStatus === 4) ? 600 : 400}
            formRef={formRef}
            trigger={
              <Button size="large" type="default">{disargeeContent(data?.status)}</Button>
            }
            modalProps={{
              onCancel: () => formRef.current?.resetFields(),
              destroyOnClose: true
            }}
            onFinish={disagreeSubmit}
          >
            {disargeeModalContent(data)}
          </ModalForm>
          <ModalForm
            layout="inline"
            title={argeeContent(data?.status)}
            width={(data?.status > 2) ? 600 : 400}
            formRef={formRef}
            trigger={
              <Button
                size="large"
                disabled={disBtn()}
                type="primary"
              >
                {argeeContent(data?.status)}
              </Button>
            }
            modalProps={{
              destroyOnClose: true,
              onCancel: ()=> formRef.current?.resetFields()
            }}
            onFinish={agreeSubmit}
          >
            {argeeModalContent(data, address)}
          </ModalForm>
        </Space>
        {
          (data?.isPlatIntervention === 1 && data?.status === 3) &&
          <p>买家已申请平台介入，如您需要提交相关的举证信息。请在24小时内进行提交</p> 
        }
      </div>
    </div>
  )
}

export default OrderDetailStatus
