import React, { useState, useEffect, useRef } from 'react';
import { Upload as AntUpload, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { getImageSize } from '@/utils/utils';
import upload from '@/utils/upload'

const Upload = (props) => {
  const { value, onChange, code = 218, maxCount = 1, size, dimension, proportion, text = '上传', disabled = false, sort = false, ...rest } = props;
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)
  const fileData = useRef([]);

  const beforeUpload = async (file) => {

    if (proportion) {
      if (proportion === 'banner') {
        message.error('请先选择位置!')
        return false;
      }
      const { width, height } = await getImageSize(file);
      if (parseInt(proportion.width / proportion.height) === parseInt(width / height)) {
        return true;
      }
      message.error('上传图片的大小不符合要求')
      return false;
    }

    if (size && file.size / 1024 > size) {
      message.error('上传文件的大小不符合要求')
      return false;
    }
    if (dimension) {
      const { width, height } = await getImageSize(file);

      if (typeof dimension === 'string' && width !== height) {
        message.error('上传图片的尺寸不符合要求')
        return false;
      }

      if (typeof dimension === 'object' && (width !== dimension.width || height !== dimension.height)) {
        message.error('上传图片的尺寸不符合要求')
        return false;
      }
    }
    return true;
  }

  const onRemove = (file) => {
    fileData.current = fileList.filter(item => item.url !== file.url)
    setFileList(fileData.current);
    onChange(maxCount === 1 ? fileData.current?.[0]?.url : fileData.current.map(item => item.url))
    return true;
  }

  const imgSort = (files) => {
    return files.sort((a, b) => {
      a = a.url.replace(/.+\//, '').replace(/.+?-y_g-/, '').replace(/\..*/, '');
      b = b.url.replace(/.+\//, '').replace(/.+?-y_g-/, '').replace(/\..*/, '');
      const c = Number.isFinite(+a);
      const d = Number.isFinite(+b);
      if (c && d) {
        return a - b;
      }
      if (c && !d) {
        return -1
      }
      if (!c && d) {
        return 1
      }
      return 0
    })
  }

  const customRequest = ({ file }) => {
    setLoading(true);
    upload(file, code)
      .then(res => {
        let arr = [...fileData.current];
        arr.push({
          ...file,
          url: res,
        })

        if (sort) {
          arr = imgSort(arr);
        }

        fileData.current = arr;
        setFileList(fileData.current);
        onChange(maxCount === 1 ? res : arr.map(item => item.url))
      })
      .finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
    if (Array.isArray(value) && value?.length) {
      fileData.current = value.map((item, index) => {
        return {
          url: item,
          uid: index
        }
      })
      setFileList(fileData.current)
    } else if (value && typeof value === 'string') {
      fileData.current = [{
        url: value,
        uid: 0
      }]
      setFileList(fileData.current)
    }
  }, [value])

  return (
    <AntUpload
      listType="picture-card"
      fileList={fileList}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      onRemove={onRemove}
      disabled={disabled}
      {...rest}
    >
      {
        (fileList.length < maxCount && !disabled)
        &&
        <div>
          {loading ? <LoadingOutlined /> : <UploadOutlined />}
          <p>{text}</p>
        </div>
      }
    </AntUpload>
  )
}

export default Upload;
