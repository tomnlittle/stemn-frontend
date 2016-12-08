// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';
import { push } from 'react-router-redux'
import { actions } from 'react-redux-form';

// Component Core
import React from 'react';
import { has, pick } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './ProjectNewModal.css';

// Sub Components
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import FileSelectInput from 'app/renderer/main/modules/FileSelectInput/FileSelectInput.jsx'
import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';
import Input from 'app/renderer/main/components/Input/Input/Input';
import ProjectLinkRemote from 'app/renderer/main/components/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
import { ArrowTabs, ArrowTab } from 'app/shared/modules/Tabs/ArrowTabs/ArrowTabs.jsx';
import ProjectPermissionsRadio from 'app/renderer/main/components/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  getInitialState () {
    return {
      tab: 1,
      linkPending: false
    }
  },
  createProject(){
    this.props.projectsActions.createProject(pick(this.props.newProject, ['permissions', 'name', 'summary'])).then(response => {
      const goToProject = () => {
        this.props.dispatch(push(`/project/${response.value.data._id}/settings`));
        this.props.modalHide();
      }
      // Link the provider if we can.
      if(response.value.data._id && this.props.newProject.provider && this.props.newProject.root.path && this.props.newProject.root.fileId){
        this.setState({linkPending: true})
        this.props.projectsActions.linkRemote({
          projectId : response.value.data._id,
          provider  : this.props.newProject.provider,
          path      : this.props.newProject.root.path,
          id        : this.props.newProject.root.fileId
        }).then(()=>{
          // After we have linked, we go to the project
          this.setState({linkPending: false});
          goToProject();
        }).catch(() => {
          // If the link fails, we still go to the project
          this.setState({linkPending: false});
          goToProject();
        })
      }
      else{
        goToProject();
      }
    });
  },
  changeTab(tab){
    this.setState({ tab: tab })
  },
  render() {
    const { newProject, entityModel, modalCancel, modalHide } = this.props;
    const { tab, linkPending } = this.state;

    const namePanelTemplate = () => {
      return (
        <div className={classes.panel}>
          <h3>Name and blurb</h3>
          <p>Set your project name and blurb.</p>
          <Input
            model={`${entityModel}.name`}
            value={newProject.name}
            className="dr-input"
            type="text"
            placeholder="Project Name"
            autoFocus={true}
          />
          <br />
          <Textarea
             model={`${entityModel}.summary`}
             value={newProject.summary}
             className="dr-input"
             placeholder="Project Summary"
           />

        </div>
      )
    }

    const permissionsTemplate = () => {
      return (
        <div className={classes.panel}>
          <h3>Project Type</h3>
          <ProjectPermissionsRadio
             model={`${entityModel}.permissions.projectType`}
             value={has(newProject, 'permissions.projectType') ? newProject.permissions.projectType : ''}
           />
        </div>
      )
    }

    const fileStoreTemplate = () => {
      return (
        <div className={classes.panel + ' rel-box'}>
          <h3>Cloud Storage Folder</h3>
          <p>Select your project's cloud store location.</p>
          <ProjectLinkRemote
            model={`${entityModel}.provider`}
            value={newProject.provider}
          />
          <br />
          <FileSelectInput
             disabled={!['drive', 'dropbox'].includes(newProject.provider)}
             provider={newProject.provider}
             model={`${entityModel}.root`}
             value={newProject.root || {}}
           />
           <LoadingOverlay show={newProject.savePending || linkPending}/>
        </div>
      )
    }

    const tabTemplate = ({title, blurb, body, button1, button2}) => {
      return (
        <div className="layout-column flex">
          <div className={classes.modalBody + ' layout-column flex'}>
            <div className="text-title-2" style={{marginBottom: '15px'}}>{title}</div>
            <div className={classes.row + ' layout-row'}>
              <div className={classes.col + ' flex-40'}>
                <div className="text-title-5">{blurb}</div>
              </div>
              <div className={classes.col + ' flex-60'}>{body}</div>
            </div>
          </div>
          <div className={classes.modalFooter + ' layout-row layout-align-end'}>
            <Button style={{marginRight: '10px'}} onClick={button1.onClick}>{button1.text}</Button>
            <Button className="primary"           onClick={button2.onClick}>{button2.text}</Button>
          </div>
        </div>
      )
    };

    const getTab = () => {
      if(tab == 1){ return tabTemplate({
        title: 'Create Project',
        blurb: 'Enter general display details such as project name and blurb. Remember to set a blurb if you want to open-source your project.',
        body: (
          <div>
            {namePanelTemplate()}
            {permissionsTemplate()}
          </div>
        ),
        button1: {
          text: 'Cancel',
          onClick: () => {modalCancel(); modalHide()}
        },
        button2: {
          text: 'Next',
          onClick: () => this.changeTab(2)
        }
      })}
      else if(tab == 2){ return tabTemplate({
        title: 'File Store',
        blurb: 'Connect a cloud provider (Dropbox or Drive). This will give you access to version control and collaboration features.',
        body: (
          <div>
            {fileStoreTemplate()}
          </div>
        ),
        button1: {
          text: 'Back',
          onClick: () => this.changeTab(1)
        },
        button2: {
          text: 'Create',
          onClick: this.createProject
        }
      })}
    }

    const tabTitles = [{
      title: 'General',
      arrow: true,
      onClick: () => {this.changeTab(1)},
      isActive: () => tab == 1
    },{
      title: 'File Store',
      arrow: false,
      onClick: () => {this.changeTab(2)},
      isActive: () => tab == 2
    }]

    return (
      <div className={classes.stepModal + ' layout-column'}>
        <div className={classes.modalTitle}>
          <ArrowTabs className="layout-row flex">
            {tabTitles.map(tab => <ArrowTab key={tab.title} arrow={tab.arrow}  onClick={tab.onClick} isActive={tab.isActive()}>{tab.title}</ArrowTab>)}
          </ArrowTabs>
        </div>
        {getTab()}
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({projects}) {
  return {
    newProject: projects.newProject,
    entityModel: 'projects.newProject',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
    dispatch
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Component);
