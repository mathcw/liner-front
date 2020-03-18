import React, { useState } from 'react';
import { Modal } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

let imageRef = null;

export default ({ originFile, visiable, onOk, onCancel, width, cropSetting, title }) => {

  const [modalVisiable, setModalVisiable] = useState(visiable);
  const [src, setSrc] = useState({});
  const [crop, setCrop] = useState(cropSetting);
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [croppedBlob, setCroppedBlob] = useState(null);

  const reader = new FileReader();
  reader.readAsDataURL(originFile);
  reader.onload = () => {
    setSrc(reader.result)
  };

  const onChange = (newCrop) => {
    setCrop(newCrop)
  }

  const onImageLoaded = image => {
    imageRef = image;
  };

  const getCroppedImg = (image, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const newBLob = blob;
        newBLob.name = fileName;
        resolve(newBLob);
      }, 'image/jpeg');
    });
  }

  const makeClientCrop = async () => {
    if (imageRef && crop.width && crop.height) {
      const newBLob = await getCroppedImg(
        imageRef,
        crop,
        originFile.name
      );
      if (croppedImageUrl !== '') {
        window.URL.revokeObjectURL(croppedImageUrl)
      }
      const ImageUrl = window.URL.createObjectURL(newBLob);
      setCroppedImageUrl(ImageUrl);
      setCroppedBlob(newBLob);
    }
  }

  const onCropComplete = () => {
    makeClientCrop();
  };

  const modalOk = () => {
    setModalVisiable(false);
    if (croppedBlob) {
      const newFile = new File([croppedBlob], originFile.name);
      if (croppedImageUrl !== '') {
        window.URL.revokeObjectURL(croppedImageUrl)
      }
      if (onOk) {
        onOk(newFile)
      }
    } else if (onOk) {
      onOk(originFile)
    }

  }

  const modalClose = () => {
    setModalVisiable(false);
    if (croppedImageUrl !== '') {
      window.URL.revokeObjectURL(croppedImageUrl)
    }
    if (onCancel) {
      onCancel();
    }
  }

  return (
    <Modal
      title={title}
      visible={modalVisiable}
      width={width}
      onOk={modalOk}
      onCancel={modalClose}
      destroyOnClose
    >
      <div style={{ width: '49%',height: '500px',display: 'flex'
        ,justifyContent:'center',alignItems: 'center',border:'1px solid #ededed' }}
      >
        <ReactCrop
          src={src}
          crop={crop}
          onChange={newCrop => onChange(newCrop)}
          onComplete={onCropComplete}
          onImageLoaded={onImageLoaded}
        />
      </div>
      <div style={{ width: '49%', position: 'absolute', top: '14%', right: '0%'}}>
        <h1>预览</h1>
        {croppedImageUrl !== '' && (
          <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
        )}
      </div>

    </Modal>
  )
}