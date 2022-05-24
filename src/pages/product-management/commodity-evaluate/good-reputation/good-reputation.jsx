import React, { useRef,useState,useEffect  } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import { Button,Image,Space,Tooltip } from 'antd';
import styles from './style.less'
import { FileFilled  } from '@ant-design/icons';
import ContentModel from './content-model';
import { getSubCommentByCount,getGoods } from '@/services/product-management/commodity-evaluate';

export default props => {
    const ref=useRef()
    const [visible,setVisible]=useState()
    const { skuId, type,spuId }=props.location.query
    const [detailList,setDetailList]=useState()
    const [commentId,setCommentId]=useState()
    const columns = [
        {
            title: '头像',
            dataIndex: 'userImg',
            valueType: 'image',
            hideInSearch: true,
        },
        {
            title: '昵称',
            dataIndex: 'nickName',
        },
        {
            title: '订单编号',
            dataIndex: 'orderSn',
            valueType: 'text',
            hideInSearch:true,
        },
        {
            title: '评价时间',
            dataIndex: 'commentTime',
            valueType: 'text',
        },
        {
            title: '评价内容',
            dataIndex: 'content',
            valueType: 'text',
            hideInSearch: true,
            render:(text, record, _, action)=>[
                <div key='content' className={styles.ellipsis}>
                    <Tooltip title={record.content}>
                      <a  onClick={()=>{setVisible(true);setCommentId(record.id)}}>{record.content?record.content:'此用户没有填写评价内容'}</a>
                    </Tooltip>
                </div>
            ],
        },
        {
            title: '点赞',
            dataIndex: 'pointNum',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '评价回复',
            dataIndex: 'applyList',
            valueType: 'text',
            hideInSearch: true,
            render:(_,data)=>{
               return <>
                 {
                    _.map((ele,index)=>(
                        <div key={index}>
                        <pre className={styles.line_feed}>{ele.replyContent}</pre>
                        <p style={{color:'#666',fontSize:'10px'}}>{ele.replyTime}</p>
                        </div>
                    ))
                 }
               </>
            }
        }
    ];
    useEffect(()=>{
        getGoods({spuId:spuId,skuId:skuId,type:type}).then(res=>{
            if(res.code==0){
                setDetailList(res.data)
            }
        })
    },[])
  return (
    <PageContainer
        header={{
            title: type==1?'好评':type==2?'中评':'差评',
            extra:[
                <Button key="1" onClick={()=>history.goBack()}>返回</Button>
            ]
        }}
    >
     <div className={styles.good_reputation}>
       <h3 className={styles.head}><FileFilled /> 商品信息</h3>
       <Space>
            <Image width={100} src={detailList?.goodsImg} />
            <div>
                <p>{detailList?.goodsName}（商品名称）</p>
                <p>{detailList?.spec}（商品规格）</p>
            </div>
       </Space>
       <h3 className={styles.head}><FileFilled /> 评价信息</h3>
        <ProTable
            rowKey="id"
            options={false}
            actionRef={ref}
            params={{
                spuId:spuId,
                skuId:skuId,
                type:type
            }}
            request={getSubCommentByCount}
            search={false}
            columns={columns}
            pagination={{
                pageSize: 10,
                showQuickJumper: true,
            }}
        />
    </div>
    {
        visible&&
        <ContentModel
            setVisible={setVisible}
            visible={visible}
            id={commentId}
            onClose={()=>ref.current.reload()}
         />
    }
  </PageContainer>
  );
};
