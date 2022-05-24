import React, { useState} from 'react';
import { ModalForm} from '@ant-design/pro-form';

import { Timeline } from 'antd';

export default props=>{
    const {record,title,byid}=props
    const [visible, setVisible] = useState(false);
    const Termination=(record)=>{
        setVisible(true)
    }
    return (
        <ModalForm
            title={title}
            key={byid}
            onVisibleChange={setVisible}
            visible={visible}
            trigger={<a onClick={()=>Termination(record)}>查看更多</a>}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => {
                 setVisible(false)   
            }}
        >
          <div style={{height:'500px',overflowY:'auto',padding:'20px'}}>
            <Timeline>
            {
                record&&record.map(ele=>{
                return <Timeline.Item>
                        <p>{ele.content}</p>
                        <p style={{color:"#C7C7C7"}}>{ele.time}</p>
                     </Timeline.Item>
                        
                })
            }
            </Timeline>
        </div>
        
    </ModalForm>
    )
}

