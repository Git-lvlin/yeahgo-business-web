import React, { useState, useEffect, useRef } from 'react';
import { IAReceivedMessage, MessageDirection } from '@rongcloud/imlib-v4'
import { List, message, Avatar, Skeleton, Divider, Input, Image, Alert } from 'antd';
import avatar from '@/assets/avatar.png';
const ConversationTextItem = (item) => {
    if (item.messageDirection == MessageDirection.SEND) {
        return SendTextItem(item)
    } else {
        return ReceiveTextItem(item)
    }
}

const ReceiveTextItem = (item) => {
    return (<div className="text-message" style={{ display: 'flex', flexDirection: 'row', marginTop: 24, justifyContent: 'start' }}>
        <Avatar size={32} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} src={item.userInfo.icon}></Avatar>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'start', marginLeft: 16 }}>
            <div>{item.userInfo.nickName}</div>
            <div style={{ width: 300, marginTop: 8, fontSize: 14, color: '#999999' }}>{item.content.content}</div>
        </div>
    </div>
    )
}
const SendTextItem = (item) => {
    return (<div className="text-message" style={{ display: 'flex', flexDirection: 'row', marginTop: 24, justifyContent: 'end' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
            <div style={{ marginRight: 16 }}>{window.localStorage.getItem('nickName')}</div>
            <div style={{ width: '30vw', marginRight: 16, marginTop: 8, fontSize: 14, color: '#999999', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>{item.content.content}</div>
        </div>
        <Avatar size={32} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} src={avatar}></Avatar>
    </div>)
}

export default ConversationTextItem