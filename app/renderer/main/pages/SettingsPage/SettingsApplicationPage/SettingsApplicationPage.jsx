// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SystemActions from 'app/shared/actions/system';
import * as StateActions from 'app/shared/actions/state';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';
import * as AutoLaunchActions from 'app/shared/modules/AutoLaunch/AutoLaunch.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from 'app/renderer/main/pages/ProjectPage/ProjectSettingsPage/ProjectSettingsPage.css'

// Sub Components
import { Link } from 'react-router';
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import ProgressButton from 'app/renderer/main/components/Buttons/ProgressButton/ProgressButton.jsx'
import FileSelectInputElectron from 'app/renderer/main/modules/FileSelectInput/FileSelectInputElectron.jsx'
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import SimpleTable        from 'app/shared/modules/Tables/SimpleTable/SimpleTable.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////



const inputStyles = {
  textTransform: 'capitalize',
  padding: '0 10px',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.03)',
  borderRight: '1px solid rgb(234, 234, 234)',
  minWidth: '80px'
}

export const Component = React.createClass({
  componentDidMount() {
    this.props.autoLaunchActions.getStatus();
  },
  confirmReset() {
    this.props.modalActions.showConfirm({
      message: 'This will clear all data and reset the application back to factory settings. This can be useful if some data has been corrupted.',
      modalConfirm: StateActions.clearState()
    })
  },
  showReleaseModal() {
    this.props.modalActions.showModal({
      modalType: 'RELEASE_NOTES'
    })
  },
  render() {
    const { system, autoLaunch, autoLaunchActions } = this.props;
    return (
      <div>
        <div className={classes.panel}>
          <h3>Cloud Providers</h3>
          <p>Set the root folder for Dropbox and Drive.</p>
          <div style={{marginBottom: '10px'}}>
            <FileSelectInputElectron
              title="Select Root Dropbox Location"
              model="system.providerPath.dropbox"
              value={system.providerPath.dropbox}>
              <div className="layout-column layout-align-center-center" style={inputStyles}>Dropbox</div>
            </FileSelectInputElectron>
          </div>
          <div style={{marginBottom: '10px'}}>
            <FileSelectInputElectron
              title="Select Root Drive Location"
              model="system.providerPath.drive"
              value={system.providerPath.drive}>
              <div className="layout-column layout-align-center-center" style={inputStyles}>Drive</div>
            </FileSelectInputElectron>
          </div>
        </div>
        <div className={classes.panel}>
          <h3>Other options</h3>
          <div className="layout-row layout-align-start-center">
            <p className="flex" style={{margin: '10px 10px 10px 0'}}>Start Stemn Desktop on system startup</p>
            <Toggle changeAction={autoLaunchActions.toggle} value={autoLaunch.status}/>
          </div>
          <div className="layout-row layout-align-start-center">
            <p className="flex" style={{margin: '10px 10px 10px 0'}}>Help improve Stemn by sending usage data</p>
            <Toggle model="system.settings.usageData" value={system.settings.usageData}/>
          </div>
        </div>
        <div className={classes.panel}>
          <h3>Application info</h3>
          <p>Stemn Desktop is currently in alpha. Please report any bugs and they will be fixed ASAP.</p>
          {system.currentVersion
          ? <SimpleTable>
              <tr><td>Stream</td><td>alpha</td></tr>
              <tr><td>Version</td><td>{system.currentVersion}</td></tr>
              <tr><td>Release Notes</td><td><a className="link-primary" onClick={this.showReleaseModal}>Click here</a></td></tr>
            </SimpleTable>
          : null}
        </div>

        <div className={classes.panel}>
          <h3>Reset application</h3>
          <p>If something goes wrong, please clear all cached data, this will reset the application back to factory settings.</p>
          <div className="layout-row layout-align-end">
            <ProgressButton className="warn" onClick={this.confirmReset}>
              Clear data
            </ProgressButton>
          </div>
        </div>
      </div>
    );
  }
});



///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({users, system, autoLaunch}, {params}) {
  return {
    system,
    autoLaunch
  };
}

function mapDispatchToProps(dispatch) {
  return {
    systemActions: bindActionCreators(SystemActions, dispatch),
    stateActions: bindActionCreators(StateActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
    autoLaunchActions: bindActionCreators(AutoLaunchActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
