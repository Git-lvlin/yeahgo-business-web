import React, { useState, useEffect, useRef } from 'react';
import { IAReceivedMessage } from '@rongcloud/imlib-v4'
import { List, message, Avatar, Skeleton, Divider, Input, Image, Alert } from 'antd';
const ConversationGoodsItem = (item) => {
    const { content } = item
    return (
        <div className="goods-message" style={{ display: 'flex', flexDirection: 'row', marginTop: 24 }}>
            <Avatar size={32} style={{ color: '#f56a00', backgroundColor: '#fde3cf' }} src={item.userInfo.icon}></Avatar>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginLeft: 16 }}>{item.userInfo.nickName}</div>
                <div style={{ marginLeft: 16, marginTop: 8, width: 208, backgroundColor: '#f5f5f5' }}>
                    <Image width={208} height={120} src={content.goodsImage} preview={false}></Image>
                    <div style={{ marginLeft: 8, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{content.goodsName}</div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ marginLeft: 8, color: 'red' }}>¥{content.goodsPrice / 100}</div>
                        <div style={{ marginLeft: 10, color: 'grey', textDecoration: 'line-through', fontSize: 12 }}>¥{content.goodsMarketPrice / 100}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ConversationGoodsItem