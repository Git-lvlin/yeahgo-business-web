import React, { useRef, useEffect, useState } from 'react';
import { message, Form,Space,Button,Modal,List,Image,Divider,Avatar} from 'antd';
import ProForm, {
  DrawerForm,
  ProFormTextArea
} from '@ant-design/pro-form';
import { history } from 'umi'
import { findContent,subCommentApply,removeApply } from '@/services/product-management/commodity-evaluate';
import styles from './style.less'


export default (props) => {
  const { setVisible, visible,id,onClose } = props;
  const formRef = useRef();
  const ref = useRef();
  const [form] = Form.useForm()
  const [dataList,setDataList]=useState()
  const [replySuc,setReplySuc]=useState(0)

  const onsubmit = (values) => {
    if(!values.replyContent){
      return message.error('请先填写回复内容')
    }
    subCommentApply({id:id,replyContent:values.replyContent}).then(res=>{
      if(res.code==0){
        setReplySuc(1)
        formRef?.current.resetFields()
      }
    })
  };

  useEffect(() => {
    findContent({id:id}).then(res=>{
      setDataList(res.data)
    })
  }, [replySuc])
  
  return (
    <DrawerForm
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      width={1000}
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
            return [];
          }
        }
      }
      onFinish={async (values) => {
        await onsubmit(values);
      }}
      className={styles.content_model}
    >
      <p>{dataList?.content}</p>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={dataList?.imgs}
        renderItem={item => (
          <List.Item>
            <Image src={item}/>
          </List.Item>
        )}
      />
      <Divider />
      <ProFormTextArea
        name="replyContent"
        label="回复"
        placeholder="如您需要对此评价进行回复，请在此输入您要回复的内容。"
      />
      <Button type="primary" style={{marginLeft:'870px'}} onClick={()=>{
        formRef?.current.submit()
      }}>
        确定
      </Button>


       <List
        header={<div>评论回复</div>}
        dataSource={dataList?.applyList}
        renderItem={item => (
          <List.Item
            extra={
            <a style={{ float:'right', width: 80 }} onClick={() => {removeApply({id:id,applyId:item.applyId}).then(res=>{
              if(res.code==0){
                setReplySuc(2)
              }
            })}}>
              删除
            </a>}
            style={{display:'block'}}
          >
            <List.Item.Meta
              // avatar={<Avatar src={dataList?.storeImg} />}
              // title={dataList?.storeName}
              description={item.replyTime}
            />
            <pre className={styles.line_feed}>
              {item.replyContent}
            </pre>
          </List.Item>
        )}
      />
    </DrawerForm>
  );
};