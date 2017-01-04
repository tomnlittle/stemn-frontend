import React from 'react';
const fileTypeIcons = require.context("app/renderer/assets/icons/filetype", true);
  
// Styles
import classNames from 'classnames';

export default React.createClass({
  getDefaultProps: function() {
    return {
      size: 30
    };
  },
  render() {
    let fileType;
    let isOther = false;
    if(this.props.type == 'file'){
      if(this.props.fileType){
        fileType = this.props.fileType.toLowerCase();
      }
      else{
        isOther = true;
        fileType = 'other';
      }
    }
    else{
      fileType = 'folder';
    }
    
    let src;
    try {
      src = fileTypeIcons(`./${fileType}.svg`);
    }
    catch(err) {
      isOther = true;
      src = fileTypeIcons(`./other.svg`);
    }
    
    const imgStyle = {
      width       : this.props.size + 'px',
      height      : this.props.size + 'px',
    }
    const textStyle = {
      position      : 'absolute',
      left          : '50%',
      bottom        : '21%',
      transform     : 'translateX(-50%)',
      color         : 'white',
      fontSize      : this.props.size * 0.24,
      fontWeight    : 'bold',
      textTransform : 'uppercase',
      lineHeight    : '1em'
    }
    return (
      <div className="rel-box" style={{marginRight : '10px'}}>
        <img style={imgStyle} src={src} />
        {isOther ? <span style={textStyle}>{fileType}</span> : null}
      </div>
    );
  }
});