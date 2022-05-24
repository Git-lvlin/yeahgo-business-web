import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { List, message, Avatar, Skeleton, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConversationItem from '../../../components/conversation-item';
import { setConversationListListener, setConversationListener, fetchConversationList, fetchConversation, fetchLastConversationDesc, sendMessage, initRongIM, setConnectListener, fetchUseInfoList, fetchUserInfoByTargetId, MESSAGE_TYPE_YG_GOODS, MESSAGE_TYPE_YG_ORDER } from '../../../utils/IMUtils'
import { MESSAGE_TYPE } from '@rongcloud/imlib-v4'
import BraftEditor from 'braft-editor'
import NormalOrderDetail from '../../order-management/normal-order/detail'
import IntensiveOrderDetail from '../../order-management/intensive-order/detail'
import ProductDetailDrawer from '@/components/product-detail-drawer'
import 'braft-editor/dist/index.css'
import { ContentUtils } from 'braft-utils'
import upload from '../../../utils/upload'

const ConversationContainer = () => {
  const [conversationList, setConversationList] = useState([]);

  const [currentTargetId, setCurrentTargetId] = useState('');
  const [chatListLoading, setChatListLoading] = useState(false);

  const [chatList, setChatList] = useState([]);

  const [editorState, setEditorState] = useState(null);
  const [editable, setEditable] = useState(false);

  const [normalOrderDetailVisible, setNormalOrderDetailVisible] = useState(false)
  const [intensiveOrderDetailVisible, setIntensiveOrderDetailVisible] = useState(false)

  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false)
  const [selectSpuId, setSelectSpuId] = useState(null)
  const [orderId, setOrderId] = useState(null)

  const [imageUrlList, setImageUrlList] = useState([])
  const [imageDataMap, setImageDataMap] = useState({})

  const refChatListLastElement = React.useRef();

  const loadHistoryChatList = () => {
    if (chatListLoading) {
      return
    }
    setChatListLoading(true)
    fetchCurrentChatList(currentTargetId, chatList[0].sentTime, true)
  }

  const inputRef = useRef()

  useEffect(async () => {
    initRongIM()
    setupListener()
    fetchLatestConversation()
  }, []);

  const setupListener = () => {
    //设置消息列表监听
    setConversationListListener(() => {
      fetchLatestConversation()
    })
    //设置消息监听
    setConversationListener(() => {
      loadMoreChatList()
    })
    //设置连接舰艇
    setConnectListener((result) => {
      if (result) {
        //重新获取会话列表
        fetchLatestConversation()
      }
    })
  }

  /**
   * 获取最新聊天列表
   */
  const fetchLatestConversation = () => {
    fetchConversationList().then(async dataList => {
      console.log(dataList)
      await fetchUseInfoList({ list: dataList.flatMap((item) => [item.targetId]) })
      setConversationList(dataList)
      if (currentTargetId.length == 0 && dataList.length > 0 && chatList.length == 0) {
        setEditable(true)
        setCurrentTargetId(dataList[0].targetId)
        fetchCurrentChatList(dataList[0].targetId)
      }
    })
  }

  /**
   * 获取当前选择的聊天内容列表
   * @param {会话ID}} targetId 
   * @param {时间戳} timestamp 
   */
  const fetchCurrentChatList = (targetId, timestamp = +new Date(), isLoadHistory = false) => {
    fetchConversation(targetId, timestamp).then(conversation => {
      setChatListLoading(false)
      if (isLoadHistory) {
        const first = chatList[0]
        setChatList([...conversation.list, ...chatList])
        //获取上次列表最前面的element
        const element = document.getElementById('item' + first.messageUId)
        if (element != null) {
          //滚动到上次看到的位置
          scrollToElementPosition(element)
        }
      } else {
        setChatList(conversation.list)
        if (refChatListLastElement != null && refChatListLastElement.current != null) {
          scrollToElementPosition(refChatListLastElement.current)
        }
      }
    })
  }

  /**
   * 发送消息
   * @param {*} content 
   * @param {*} type 
   */
  const sendMesageContent = (content, type) => {
    sendMessage(currentTargetId, content, type)
  }


  const submitContent = () => {
    // sendMesageContent({
    //   goodsName: "皮尔卡丹 可水洗空调被夏凉被 水洗棉纯色夏被双人被子薄被芯 动感兰 200*230cm",
    //   orderSn: 16315854646816897347,
    //   skuImageUrl: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/base/rc-upload-1624367466264-15%E8%A2%AB%E5%AD%902.jpg?x-oss-process=image/resize,h_541,w_541",
    //   skuName: "",
    //   skuNum: 1,
    //   skuSalePrice: 200,
    //   status: 5,
    //   subId: 1437599748641333250,
    //   sumId: 1437599748641333249
    // }, MESSAGE_TYPE_YG_ORDER)
    //发送图片消息
    sendImageMessage()
    //发送文本消息
    sendTextMessage()
    //清空输入内容
    setEditorState(BraftEditor.createEditorState(null))
    //更新当前聊天列表
    fetchCurrentChatList(currentTargetId)
  }

  /**
   * 发送图片消息
   */
  const sendImageMessage = () => {
    const htmlStr = editorState.toHTML()
    if (htmlStr.indexOf('<img') != -1) {//包含图片标签，发送图片消息
      imageUrlList.forEach(item => {
        const imageData = imageDataMap[item]
        sendMesageContent({ imageUri: item, content: imageData }, MESSAGE_TYPE.IMAGE)
      })
      setImageUrlList([])
      setImageDataMap({})
    }
  }

  /**
   * 发送文本消息
   */
  const sendTextMessage = () => {
    var text = editorState.toText()
    text = text.replace(/\ +/g, "");//去掉空格
    text = text.replace(/[ ]/g, "");    //去掉空格
    text = text.replace(/[\r\n]/g, "");//去掉回车换行
    if (text.length > 0) {
      sendMesageContent({ content: text }, MESSAGE_TYPE.TEXT)

    }
  }

  /**
   * 富文本内容变更监听
   * @param {editState} content 
   */
  const editChange = (content) => {
    setEditorState(content)
    const htmlStr = content.toHTML()
    if (imageUrlList.length > 0) {
      var newImageList = imageUrlList
      imageUrlList.forEach(item => {
        //富文本会修改url,分割之后再做对比
        const imageUrl = item.split('&')[0]
        if (htmlStr.indexOf(imageUrl) === -1) {
          //过滤需要删除的图片
          newImageList = newImageList.filter((val) => {
            return val != item
          })
          var newImageDataMap = imageDataMap
          newImageDataMap[item] = undefined
          setImageDataMap(newImageDataMap)
        }
      })
      setImageUrlList[newImageList]
    }
  }

  /**
   * 滚动到指定节点位置
   * @param {节点} element 
   */
  const scrollToElementPosition = (element) => {
    element.scrollIntoView({ block: "end", inline: "end" })
  }

  /**
   * 会话点击
   * @param {会话} item 
   */
  const itemClick = (item) => {
    if (item.messageType == MESSAGE_TYPE_YG_GOODS) {
      setSelectSpuId(item.content.spuId);
      setProductDetailDrawerVisible(true);
    } else if (item.messageType == MESSAGE_TYPE_YG_ORDER) {
      if (item.content.orderType == 2 || item.content.orderType == 17 || item.content.orderType == 18) {
        //2:秒约订单;17:盲盒；18:签到
        setOrderId(item.content.orderId)
        setNormalOrderDetailVisible(true)
      } else if (item.content.orderType == 5 || item.content.orderType == 6) {
        //5:指令集约；6:主动集约
        setOrderId(item.content.orderId)
        setIntensiveOrderDetailVisible(true)
      }
    }
  }

  /**
   * 粘贴文件监听、插入文件
   * @param {粘贴的文件} files 
   */
  const handlePastedFiles = (files) => {
    if (files.length > 1) {
      message.error('暂不支持粘贴多张图片');
      return
    }
    if (files[0].type.indexOf('image') != -1) {
      var file = new File([files[0]], new Date().getTime() + ".png", { type: "image/png" });
      //上传图片
      upload(file, 306)
        .then(res => {
          //更新图片列表
          setImageUrlList([...imageUrlList, res])
          handleCompressImage(files[0], res)

          // 使用ContentUtils.insertMedias来插入媒体到editorState
          const imageEditorState = ContentUtils.insertMedias(editorState, [
            {
              type: 'IMAGE',
              url: res,
              height: 120
            }
          ])
          setEditorState(imageEditorState)
        })
    } else {
      message.error('当前仅支持粘贴图片');
    }
  }

  //压缩图片
  const handleCompressImage = (img, imageUrl) => {
    let reader = new FileReader();
    // 读取文件
    reader.readAsDataURL(img);
    reader.onload = function (e) {
      let image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        // 定义 canvas 大小，也就是压缩后下载的图片大小
        let imageWidth = image.width; //压缩后图片的大小
        let imageHeight = image.height;

        image.width = 150
        image.height = imageHeight * 150 / imageWidth

        canvas.width = 150;
        canvas.height = imageHeight * 150 / imageWidth;
        context.drawImage(image, 0, 0, 150, imageHeight * 150 / imageWidth);
        const imageData = canvas.toDataURL(`image/jpg`);
        var newImageDataMap = imageDataMap
        newImageDataMap[imageUrl] = imageData.split(',')[1]//截取掉前缀
        setImageDataMap(newImageDataMap)
      };
    };
  }

  const hooks = {
    'remove-medias': ({ href, target }) => {
      console.log(href)
    }
  }

  return (

    <PageContainer>
      <div id="customerChat"
        style={{
          width: '100%',
          height: '80vh',
          display: 'flex',
          flexDirection: 'row'
        }}>
        <div
          id="conversationList"
          style={{
            height: '100%',
            width: 220,
            overflow: 'auto',
            border: '1px solid rgba(140, 140, 140, 0.35)',
          }}
        >
          <InfiniteScroll
            dataLength={conversationList.length}
            endMessage={conversationList.length > 10 ? <Divider plain>没有更多数据</Divider> : null}
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={conversationList}
              renderItem={item => {
                const user = fetchUserInfoByTargetId(item.targetId)
                item.userInfo = user
                return <List.Item key={item.id} onClick={() => {
                  if (item.targetId === currentTargetId) {
                    return
                  }
                  setCurrentTargetId(item.targetId)
                  fetchCurrentChatList(item.targetId)
                }} style={{ backgroundColor: item.targetId === currentTargetId ? 'white' : 'transparent', paddingTop: 16, paddingBottom: 16, paddingLeft: 10, paddingRight: 10 }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.userInfo.icon} />}
                    title={<div style={{ color: '#666666', fontSize: 16 }}>{item.userInfo.nickName}</div>}
                    description={fetchLastConversationDesc(item)}
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  />
                </List.Item>
              }}
            />
          </InfiniteScroll>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
          <div
            style={{
              height: '100%',
              flex: 1,
              overflow: 'auto',
              padding: '0 16px',
              paddingBottom: '24px',
              border: '1px solid rgba(140, 140, 140, 0.35)',
            }}
          >
            <InfiniteScroll
              id='chatList'
              dataLength={chatList.length}
              hasMore={false}
              scrollableTarget="scrollableDiv"
              refreshFunction={loadHistoryChatList}
              pullDownToRefresh
              pullDownToRefreshThreshold={10}
              pullDownToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>
                  &#8595; 下拉刷新
                </h3>
              }
              releaseToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>
                  &#8593; 放开刷新
                </h3>
              }
            >
              <List
                dataSource={chatList}
                renderItem={(item, index) => {
                  const user = fetchUserInfoByTargetId(item.targetId)
                  item.userInfo = user
                  return <div ref={index == chatList.length - 1 ? refChatListLastElement : null} id={'item' + item.messageUId} onClick={() => {
                    itemClick(item)
                  }}>
                    <ConversationItem item={item} />
                  </div>
                }
                }
              />
            </InfiniteScroll>
          </div>
          <div style={{ border: '1px solid rgba(140, 140, 140, 0.35)', height: 200 }}>
            <BraftEditor
              ref={inputRef}
              value={editorState}
              controls={[]}
              media={{ pasteImage: false }}
              style={{ height: 200 }}
              placeholder={'请输入回复内容'}
              onSave={submitContent}
              handleReturn={submitContent}
              onChange={editChange}
              handlePastedFiles={handlePastedFiles}
              stripPastedStyles={true}
              contentStyle={{ height: 140 }}
              hooks={hooks}
              readOnly={!editable}
            />
          </div>
        </div>
      </div>
      {
        normalOrderDetailVisible &&
        <NormalOrderDetail
          id={orderId}
          visible={normalOrderDetailVisible}
          setVisible={setNormalOrderDetailVisible}
        />
      }
      {
        intensiveOrderDetailVisible &&
        <IntensiveOrderDetail
          id={orderId}
          visible={intensiveOrderDetailVisible}
          setVisible={setIntensiveOrderDetailVisible}
        />
      }

      {
        productDetailDrawerVisible &&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={selectSpuId}
        />
      }
    </PageContainer>
  )
}
export default ConversationContainer;