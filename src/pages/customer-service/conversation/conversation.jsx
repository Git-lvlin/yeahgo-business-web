import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';

const Conversation = () => {
  return (
    <PageContainer>
      <ProCard.Group title="常用功能" headerBordered>
        <ProCard colSpan="148px">
          <div className={style.card}>
            <div>
              <img />
            </div>
            <span>聊天列表</span>
          </div>
        </ProCard>
        <ProCard colSpan="148px">
          <div className={style.card}>
            <div>
              <img />
            </div>
            <span>聊天窗口</span>
          </div>
        </ProCard>
      </ProCard.Group>
    </PageContainer>
  )
}
export default Conversation;