import React, {PropTypes} from 'react';
import { getDownloadUrl } from '../../Files.utils.js';

export default React.createClass({
  render() {
    const { fileMeta } = this.props;
    return (
      <div className="flex rel-box layout-column">
        <iframe className="flex" src={`https://docs.google.com/gview?url=${getDownloadUrl(fileMeta)}&embedded=true`} style={{border: 'none'}}></iframe>
      </div>
    )
  }
});
