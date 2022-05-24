import React, { useState, useEffect, useRef } from 'react';
import { IAReceivedMessage, MessageDirection } from '@rongcloud/imlib-v4'
import { List, message, Avatar, Skeleton, Divider, Input, Image, Alert } from 'antd';
import avatar from '@/assets/avatar.png';
const ConversationImageItem = (item) => {
    if (item.messageDirection == MessageDirection.SEND) {
        return SendImageItem(item)
    } else {
        return ReceiveImageItem(item)
    }

}

const ReceiveImageItem = (item) => {
    return (
        <div className="image-message" style={{ display: 'flex', flexDirection: 'row', marginTop: 24 }} onClick={() => { }}>
            <Avatar size={32} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} src={item.userInfo.icon}></Avatar>
            <div style={{ display: 'flex', flexDirection: 'column', margin: '0 16px' }}>
                {item.userInfo.nickName}
                <div style={{ marginTop: 8, width: 300, backgroundColor: '#f5f5f5' }}>
                    <Image width={300} src={item.content.imageUri} style={{ backgroundSize: 'cover' }}></Image>
                </div>
            </div>
        </div >
    )
}
const SendImageItem = (item) => {
    return (
        <div className="image-message" style={{ display: 'flex', flexDirection: 'row', marginTop: 24, justifyContent: 'end' }} onClick={() => { }}>
            <div style={{ display: 'flex', flexDirection: 'column', margin: '0 16px', alignItems: 'end' }}>
                {window.localStorage.getItem('nickName')}
                <div style={{ marginTop: 8, width: 300, backgroundColor: '#f5f5f5' }}>
                    <Image width={300} src={item.content.imageUri} style={{ backgroundSize: 'cover' }}></Image>
                </div>
            </div>
            <Avatar size={32} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} src={avatar}></Avatar>
        </div >
    )
}
export default ConversationImageItem