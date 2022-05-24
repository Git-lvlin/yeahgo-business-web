import React, { useState, useEffect, useRef } from 'react';
import { IAReceivedMessage } from '@rongcloud/imlib-v4'
import { List, message, Avatar, Skeleton, Divider, Input, Image, Alert } from 'antd';
const ConversationOrderItem = (item) => {
    const { content } = item
    return (
        <div className="order-message" style={{ display: 'flex', flexDirection: 'row', marginTop: 24, }} onClick={() => { }}>
            <Avatar size={32} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} src={item.userInfo.icon}></Avatar>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginLeft: 16 }}>{item.userInfo.nickName}</div>
                <div style={{ marginLeft: 16, marginTop: 8, padding: 8, width: 300, backgroundColor: '#f5f5f5' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Image width={80} height={80} src={content.skuImageUrl} preview={false}></Image>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div style={{ marginLeft: 8, color: '#333333', fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{content.goodsName}</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#999999' }}>订单号:{content.orderSn}</div>
                </div>
            </div>
        </div>
    )
}
export default ConversationOrderItem