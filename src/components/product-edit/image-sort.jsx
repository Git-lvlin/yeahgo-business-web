import React, { useState, useEffect } from 'react';
import { Button, Image, Tooltip} from 'antd';
import {
  ModalForm,
} from '@ant-design/pro-form';
import { arrayMove, SortableElement, SortableContainer } from 'react-sortable-hoc';

const gridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridGap: '16px',
  maxHeight: 500,
  overflow: 'auto',
};

const gridItemStyles = {
  width: 100,
  height: 100,
  // backgroundColor: '#e5e5e5',
  zIndex: 9999
};

const GridItem = SortableElement(({ value, _index, fileFlag }) => {
  const fileName = decodeURIComponent(value.replace(/.+?-y_g-/, '').replace(/\?.*/, ''));
  return (
    <div style={gridItemStyles}>
      <div style={{ position: 'relative' }}>
        <Image src={value} width={100} height={100} />
        <div style={{ position: 'absolute', top: 0, left: 0, background: 'rgba(0,0,0,0.8)', color: '#fff', padding: 2 }}>{_index + 1}</div>
        {fileFlag && <Tooltip title={fileName}><div style={{ position: 'absolute', overflow: 'hidden', whiteSpace: 'nowrap', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.8)', color: '#fff', padding: 2 }}>{fileName}</div></Tooltip>}
      </div>
    </div>
  )
});

const Grid = SortableContainer(({ items, fileFlag }) =>
  <div style={gridStyles}>
    {items.map((value, index) =>
      <GridItem
        key={index}
        index={index}
        _index={index}
        value={value}
        fileFlag={fileFlag}
      />
    )}
  </div>
);

const ImageSort = ({ callback, data }) => {

  const [items, setItems] = useState([])
  const [fileFlag, setFileFlag] = useState(false);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  useEffect(() => {
    const flag = !!data.length && data.every(item => item.includes('-y_g-'))
    setFileFlag(flag)
    setItems(data)
  }, [data])

  return (
    <ModalForm
      title="图片排序"
      modalProps={{
        width: 500,
        destroyOnClose: true,
        afterClose: () => {
          setItems(data)
        }
      }}
      trigger={
        <Button type="primary" >
          图片排序
        </Button>
      }
      onFinish={() => {
        callback(items);
        return true;
      }}
    >
      <div style={{ color: 'red', marginBottom: 10 }}>操作提示：拖动图片调整显示顺序</div>
      <Grid distance={1} items={items} fileFlag={fileFlag} onSortEnd={onSortEnd} axis="xy" />
    </ModalForm >
  )
}

export default ImageSort;
