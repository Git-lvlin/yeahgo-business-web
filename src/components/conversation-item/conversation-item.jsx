import React, { useState, useEffect, useRef } from 'react';
import { IAReceivedMessage } from '@rongcloud/imlib-v4'
import ConversationTextItem from './conversation-text-item';
import ConversationImageItem from './conversation-image-item';
import ConversationGoodsItem from './conversation-goods-item';
import ConversationOrderItem from './ conversation-order-item';


const ConversationItem = (props) => {
    const { item } = props
    if (item.messageType === 'RC:TxtMsg') {
        return ConversationTextItem(item)
    } else if (item.messageType === 'RC:ImgMsg') {
        return ConversationImageItem(item)
    } else if (item.messageType === 'app:YGGoodsMsg') {
        return ConversationGoodsItem(item)
    } else if (item.messageType === 'app:YGOrderMsg') {
        return ConversationOrderItem(item)
    }
    return null;
}
export default ConversationItem