import React from 'react';

import PreviewCode  from './PreviewCode/PreviewCode'
import PreviewPcb   from './PreviewPcb/PreviewPcb'
import PreviewPdf   from './PreviewPdf/PreviewPdf'
import PreviewImage from './PreviewImage/PreviewImage'
import PreviewCad   from './PreviewCad/PreviewCad'

import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';


import {getViewerType} from './previewFileUtils'
// Styles
import classNames from 'classnames';

export default class extends React.Component{
  componentWillMount() {
    this.props.filesActions.getFile({
      projectId: this.props.project._id,
      fileId: this.props.file.fileId,
      revisionId: this.props.file.revisionId
    })
  }
  render() {
    console.log(this.props);
    const {file, fileData, project} = this.props;

    const getPreview = () => {
      const viewerType = getViewerType(file.extension);
      console.log(viewerType);
      if(viewerType == 'gerber' || viewerType == 'pcb'){
        return <PreviewPcb model={this.props.file.data} fileType={this.props.file.meta.fileType} />
      }
      else if(viewerType == 'code'){
        return fileData ? <PreviewCode project={project} file={file} fileData={fileData}/> : <LoadingOverlay />
      }
      else if(viewerType == 'autodesk'){
        return <PreviewCad fileMeta={this.props.file.meta} />
      }
      else if(viewerType == 'google'){
        return <div>Google</div>
      }
      else if(viewerType == 'image'){
        return <PreviewImage project={project} file={file} />
      }
      else if(viewerType == 'pdf'){
        return <PreviewPdf model={this.props.file.data} fileType={this.props.file.meta.fileType} />
      }
      else{
        return <div>Other</div>
      }
    }
    return (
      <div className="layout-column flex rel-box">
        {getPreview()}
      </div>
    );
  }
};
