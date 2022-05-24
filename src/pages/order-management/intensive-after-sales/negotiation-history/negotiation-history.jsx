import { Avatar, Image } from 'antd'

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

const NegotiationHistory = ({data}) => {
  return data.map((res, idx) => {
    return (
      <div className={styles.warp} key={idx}>
        <div className={styles.avatar}>
          <Avatar
            size={54}
            src={res?.operatorAvatar}
          />
        </div>
        <div className={styles.list}>
          <div className={styles.top}>
            <div className={styles.name}>
              {
                res?.operatorName
              }
            </div>
            <div className={styles.time}>
              {res?.createTime}
            </div>
          </div>
          <div className={ styles.content }>
            <div className={ styles.text }>{res?.contentDisplay}</div>
            <PreviewGroup>
              <VoucherPic pic={(res?.voucherPics)}/>
            </PreviewGroup>
          </div>
        </div>
      </div>
    )
  })
}

export default NegotiationHistory
