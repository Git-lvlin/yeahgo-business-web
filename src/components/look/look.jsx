import React, { useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
} from '@ant-design/pro-form';
import style from './look.less';

export default (props) => {
  const { visible, setVisible, callback, dataList } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('dataList', dataList)
  }, [dataList])

  return (
    <ModalForm
      title={`预览`}
      onVisibleChange={setVisible}
      visible={visible}
      width={400}
      form={form}
      submitter={{
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
    >
      <div className={style.box}>
        <div className={style.boxs}>
          <div className={style.head}>
            <div className={style.headbox}>
              {
                dataList.primaryImages.map((item, index) => {
                  return <img className={style.img} key={index} src={item.imageUrl||item} />
                })
              }
            </div>
          </div>
          <div className={style.text}>
            <div className={style.name}>{dataList.goods?.goodsName || '-'}</div>
            {(dataList.goods?.salePrice||dataList.goods?.salePrice==0)&&<div className={style.price}>{`￥${dataList.goods.salePrice/100}`}</div>}
          </div>
          <div>
            {
              dataList.detailImages.map((item, index) => {
                return <img className={style.img} key={index} src={item.imageUrl||item} />
              })
            }
          </div>
        </div>
      </div>
    </ModalForm >
  );
};