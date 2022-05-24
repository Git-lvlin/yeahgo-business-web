import React, { useState, useEffect,useRef } from 'react';
import { ModalForm} from '@ant-design/pro-form';
import { ClearOutlined  } from '@ant-design/icons';
import { Button,message } from 'antd';

export default props=>{
    const {text,InterFace,title,byid,orderId,getDetailData}=props
    const [visible, setVisible] = useState(false);
    const Termination=()=>{
        setVisible(true)
    }
    return (
        <ModalForm
            title={title}
            key="model2"
            onVisibleChange={setVisible}
            visible={visible}
            trigger={<a  onClick={()=>Termination()}><ClearOutlined style={{fontSize:'20px',color:'#C8C8C8'}}/></a>}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => {
                   if(orderId){
                    var data={
                        ids:[byid],
                        orderId:orderId
                    }
                   }else{
                    var data={
                        id:byid
                    }
                   }
                    InterFace(data).then(res=>{
                        if(res.code==0){
                            setVisible(false)   
                            getDetailData()
                            message.success('删除成功')
                            return true;
                        }
                    })
               
            }}
        >
        <p>{text}</p>
    </ModalForm>
    )
}

