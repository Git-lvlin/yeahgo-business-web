import { Avatar, Image } from 'antd'
import moment from 'moment'

import { amountTransform } from '@/utils/utils'
import styles from './styles.less'

const { PreviewGroup } = Image

const VoucherPic = ({pic}) => {
  return pic && pic?.map(res => {
    if(res){
      return (
        <Image
          key={res}
          width={60}
          height={60}
          src={res}
        />
      )
    }
  })
}
const optType = (type, data) => {
  const { parameterMap } = data
  switch(type) {
    case 1:
    case 4:
      return `发起了${parameterMap?.afterSalesType}申请，等待商家审核。退货原因：${parameterMap?.reason}，退款金额：¥${amountTransform(parameterMap?.returnAmount, '/').toFixed(2)}`
    case 2:
      return `商家拒绝了申请。拒绝原因：${data?.description}`
    case 3:
      return `商家拒绝了申请。拒绝原因：空`
    case 5:
      return `买家申请了平台介入。申诉原因：${data?.description}`
    case 9:
      return `商家确认收货地址：${parameterMap?.receiveMan}，${parameterMap?.receivePhone}，${parameterMap?.receiveAddress}`
    case 6:
    case 7:
    case 15:
    case 16:
      return `${data?.description}`
    case 8:
      return `商家同意了本次售后服务申请。`
    case 10:
      return `买家已退货。商品退回方式：${parameterMap?.returnMode}，快递公司：${parameterMap?.expressName}，运单编号：${parameterMap?.shippingCode}`
    case 11:
      return `商家已同意退款。`
    case 12:
      return `商家拒绝了退款。拒绝原因：${data?.description}`
    case 13:
      return `因商家超时未处理，系统默认为商家拒绝退款。拒绝原因：空`
    case 14:
      return `买家申请了平台介入。申诉原因：${data?.description}`
    case 17:
      return `买方超时未处理，系统已关闭本次售后服务。`
    case 18:
      return `因买家主动撤销申请，系统已关闭本次售后服务。`
    case 19:
      return `商家申请了平台介入。申诉原因：${data?.description}`
    case 20:
      return `售后关闭`
  }
}

const NegotiationHistory = ({data}) => {
  return data?.map(res => {
    return (
      <div className={styles.warp} key={res.id}>
        <div className={styles.avatar}>
          <Avatar
            size={54}
            src={
              res?.createRole == 1
              ? res?.sysLogo
              : (res?.createRole == 2)
              ? res?.storeLogo
              : res?.userHeadUrl
            }
          />
        </div>
        <div className={styles.list}>
          <div className={styles.top}>
            <div className={styles.name}>
              {
                res?.createRole == 1
                ? '系统'
                : (res?.createRole == 2)
                ? res?.storeName
                : res?.userName
              }
            </div>
            <div className={styles.time}>
              {moment(res?.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </div>
          <div className={ styles.content }>
            <div className={ styles.text }>{optType(res?.optType, res)}</div>
            <PreviewGroup>
              <VoucherPic pic={(res?.imageUrl)?.split(',')}/>
            </PreviewGroup>
          </div>
        </div>
      </div>
    )
  })
}

export default NegotiationHistory
