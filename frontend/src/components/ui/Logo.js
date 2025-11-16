import React from 'react';
import logoImg from '../../assets/logo.png';

const Logo = ({ src = logoImg, alt = 'Connectivity', height, width, size, style = {}, className = '' }) => {
  const imgStyle = { ...style };

  if (size !== undefined) {
    imgStyle.height = typeof size === 'number' ? `${size}px` : size;
    imgStyle.width = 'auto';
  } else {
    if (height !== undefined) imgStyle.height = typeof height === 'number' ? `${height}px` : height;
    if (width !== undefined) imgStyle.width = typeof width === 'number' ? `${width}px` : width;
  }

  return <img src={src} alt={alt} style={imgStyle} className={className || 'app-logo'} />;
};

export default Logo;