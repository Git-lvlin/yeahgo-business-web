import { init, ConversationType } from '@rongcloud/imlib-v4'
import request from '@/utils/request';

export const im = init({ appkey: 'sfci50a7sjmli' })

var conversationListChange = null
var conversationChange = null
var connectSateChange = null

var connectState = 0//0:未连接；1:已连接

var userInfoMap = {}//用户信息map，key:targetId,value:userInfo

export const MESSAGE_TYPE_YG_GOODS = 'app:YGGoodsMsg'
export const MESSAGE_TYPE_YG_ORDER = 'app:YGOrderMsg'

/**
 * 初始化融云
 */
export const initRongIM = () => {
    if (connectState == 0) {
        setupListener()
        fetchRongToken()
        var messageType = MESSAGE_TYPE_YG_ORDER; // 自定义消息类型
        var isPersited = true; // 自定义消息存储属性
        var isCounted = true;  // 自定义消息计数属性
        im.registerMessageType(messageType, isPersited, isCounted);
    }
}

/**
 * 设置会话列表监听
 * @param {会话列表回调} func
 */
export const setConversationListListener = (func) => {
    conversationListChange = func
}

/**
 * 设置会话监听
 * @param {会话回调} func
 */
export const setConversationListener = (func) => {
    conversationChange = func
}

/**
 * 设置连接监听
 * @param {连接监听回调} func 
 */
export const setConnectListener = (func) => {
    connectSateChange = func
}


/**
 * 请求用户信息列表
 * @param {请求参数}} params 
 * @param {} options 
 * @returns 
 */
export const fetchUseInfoList = async (params = {}, options = {}) => {
    const userIdList = params.list
    userIdList.filter((userId) => {
        return userInfoMap[userId] != null
    })
    params['list'] = userIdList
    const res = await request('/auth/jump/url', {
        method: 'POST',
        data: {
            requestUrl: '/java-admin/memberInfo/searchByIdS',
            ...params
        },
        ...options
    })
    const records = res.data.records
    if (records != null & records.length > 0) {
        records.forEach(item => {
            userInfoMap[item.id] = item
        })
    }
    return userInfoMap
}

/**
 * 根据用户id获取缓存用户信息
 * @param {用户id} targetId 
 * @returns 
 */
export const fetchUserInfoByTargetId = (targetId) => {
    const user = userInfoMap[targetId]
    return user ? user : { icon: 'https://uat-yeahgo-oss.yeahgo.com/miniprogram/common/default_avatar.png', nickName: targetId.substring(0, 3) + '***' + targetId.substring(targetId.length - 4, targetId.length - 1) }
}

// 获取融云Token
const fetchRongToken = async (options = {}) => {
    const userId = window.localStorage.getItem('smsId')
    if (userId != null && userId.length > 0) {
        console.log('userId:' + userId)
        const res = await request('/auth/jump/url', {
            method: 'POST',
            data: {
                requestUrl: '/java-admin/message/background/user/register',
                ...{ 'userId': userId, 'type': 3 }
            },
            ...options
        })
        if (res?.data.records.token != null && res?.data.records.token.length > 0) {
            connectRongIM(res?.data.records.token)
        }
    }
}

//连接融云
const connectRongIM = (token = '') => {
    im.connect({ token: token }).then(user => {
        connectState = 1
        console.log('链接成功, 链接用户 id 为: ', user.id);
        if (connectSateChange != null) {
            connectSateChange(1)
        }
    }).catch(error => {
        console.log('链接失败: ', error.code, error.msg);
        connectSateChange(0)
    });
}

//设置消息监听
const setupListener = () => {
    // 添加事件监听
    im.watch({
        // 监听会话列表变更事件
        conversation(event) {
            // 发生变更的会话列表
            console.log('会话列表发生变化：')
            console.log(event.updatedConversationList)
            if (conversationListChange != null) {
                conversationListChange()
            }
        },
        // 监听消息通知
        message(event) {
            // 新接收到的消息内容
            const message = event.message;
            //监听到当前聊天新消息刷新列表
            if (message.content.typingContentType == null && conversationChange != null) {
                conversationChange()
            }
        },
        // 监听 IM 连接状态变化
        status(event) {
            console.log('connection status:', event.status);
        },
    });
}

/**
 * 
 * @returns 获取会话列表
 */
export const fetchConversationList = () => {
    // 获取会话列表
    return im.Conversation.getList()
}

/**
 * 根据会话ID获取会话列表
 * @param {会话id} targetId 
 * @param {*} timestamp 
 * @returns 
 */
export const fetchConversation = (targetId, timestamp = +new Date()) => {
    const conversation = im.Conversation.get({
        targetId: targetId,
        type: ConversationType.PRIVATE
    });
    const option = {
        // 获取历史消息的时间戳，默认为 0，表示从当前时间获取
        timestamp: timestamp,
        // 获取条数，有效值 1-20，默认为 20
        count: 20,
    };
    return conversation.getMessages(option)
}

/**
 * 根据会话解析消息描述信息
 * @param {会话} conversation 
 * @returns 
 */
export const fetchLastConversationDesc = (conversation) => {
    if (conversation.latestMessage != null) {
        if (conversation.latestMessage.messageType === 'RC:TxtMsg') {
            return conversation.latestMessage.content.content
        } else if (conversation.latestMessage.messageType === 'RC:ImgMsg') {
            return '【图片消息】'
        } else if (conversation.latestMessage.messageType === 'app:YGGoodsMsg') {
            return '【商品消息】'
        } else if (conversation.latestMessage.messageType === 'app:YGOrderMsg') {
            return '【订单消息】'
        }
    }
    return '未知消息'
}

/**
 * 发送消息
 * @param {会话id} targetId 
 * @param {发送内容} content 
 * @param {消息类型} type 
 * @returns 
 */
export const sendMessage = (targetId, content, type) => {
    // 获取指定会话的抽象实例，对于会话的操作基于此实例完成
    const conversation = im.Conversation.get({
        // targetId
        targetId: targetId,
        // 会话类型：RongIMLib.CONVERSATION_TYPE.PRIVATE | RongIMLib.CONVERSATION_TYPE.GROUP
        type: ConversationType.PRIVATE
    });
    // 向会话内发消息
    return conversation.send({
        // 消息类型，其中 RongIMLib.MESSAGE_TYPE 为 IMLib 内部的内置消息类型常量定义
        messageType: type, // 'RC:TxtMsg'
        // 消息内容
        content: content
    })
}

