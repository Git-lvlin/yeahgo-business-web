import React, { useState,useEffect } from 'react';
import { Form, Button,Divider,Descriptions,Image} from 'antd';
import { refundInfo } from '@/services/order-management/stockout-apply';
import {DrawerForm } from '@ant-design/pro-form';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 14 },
  layout: {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  }
};

export default (props) =>{
  const {setVisible,visible,onClose,callback,record}=props
  const [orderDetail, setOrderDetail] = useState()
  const [form] = Form.useForm();
  useEffect(()=>{
    refundInfo({orSn:record?.orSn,supplierId:record?.supplierId}).then(res => {
      setOrderDetail(res?.data)
    })
  }, [record])
  return (
      <DrawerForm
        title='缺货单详情'
        onVisibleChange={setVisible}
        visible={visible}
        width={1200}
        form={form}
        drawerProps={{
          forceRender: true,
          destroyOnClose: true,
          onClose: () => {
            onClose();
          }
        }}
        submitter={
            {
              render: (props, defaultDoms) => {
                return [
                  <Button type="default" onClick={() => {setVisible(false);onClose()}}>
                    返回
                  </Button>
                ];
              }
            }
          }
        onFinish={async (values)=>{
        }}
        {...formItemLayout}
      >
        <Divider />
        <Descriptions labelStyle={{fontWeight:'bold'}} column={2} bordered>
        <Descriptions.Item  label="缺货单编号">{orderDetail?.baseInfo?.orSn}  </Descriptions.Item>
        <Descriptions.Item  label="申请时间">{orderDetail?.baseInfo?.createTime}  </Descriptions.Item>
        <Descriptions.Item  label="关联集约采购单号">{orderDetail?.returnInfo?.poNo}  </Descriptions.Item>
        <Descriptions.Item  label="集约活动ID">{orderDetail?.goodsInfo?.wsId}  </Descriptions.Item>
        <Descriptions.Item  label="采购商品">
          <div style={{display:'flex',alignItems:'center'}}>
            <Image src={orderDetail?.goodsInfo?.imageUrl} width={50} height={50}/>
            <p style={{marginLeft:'10px'}}>{orderDetail?.goodsInfo?.goodsName}</p>
          </div>  
        </Descriptions.Item>
        <Descriptions.Item  label="库存单位">{orderDetail?.goodsInfo?.unit}  </Descriptions.Item>
        <Descriptions.Item  label="采购数量">{orderDetail?.returnInfo?.totalNum}  </Descriptions.Item>
        <Descriptions.Item  label="缺货数量"><span style={{color:'red'}}>{orderDetail?.returnInfo?.returnNum}</span></Descriptions.Item>
        <Descriptions.Item  label="采购单状态">
          {{1:'待发货',2:'待收货',3:'已收货/待配货（等待配送给店主）',4:'配货中（配货给店主）',5:'订单完成（所有店主订单已配送完成）',6:'订单完结',7:'订单关闭'}[orderDetail?.returnInfo?.orderStatus]}  
        </Descriptions.Item>
        <Descriptions.Item  label="收货方">{orderDetail?.returnInfo?.operationName}</Descriptions.Item>
    </Descriptions>
      </DrawerForm>
  )
}
