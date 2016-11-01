// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';
import moment from 'moment';
import { actions } from 'react-redux-form';
import getUuid from 'app/shared/helpers/getUuid.js';

// Styles
import classNames from 'classnames';
import classes from './TaskMentionModal.css';

// Helpers
import howMany from 'app/shared/helpers/strings/howMany.js';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Input from 'app/renderer/main/components/Input/Input/Input';
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import TaskRow from './TaskRow/TaskRow.jsx';
import MdSearch from 'react-icons/md/search';
import { filterBoard, getAllTasks } from 'app/renderer/main/modules/Tasks/Tasks.utils.js';
import TasksFilterMenu from 'app/renderer/main/modules/Tasks/TasksFilterMenu/TasksFilterMenu.jsx';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';

///////////////////////////////// COMPONENT /////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.task){
    if(!prevProps || nextProps.task.project._id !== prevProps.task.project._id){
    }
  }
}
export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},
  submit(){
    // Get the mentions
    const mentions = getMentionsFromObject(this.props.mentions, this.props.tasks);
    // Clear props.mentions;
    this.props.dispatch(actions.change(this.props.mentionsModel, {}))

    this.props.modalConfirm({mentions});
    this.props.modalHide();
  },
  cancel(){
    this.props.modalCancel();
    this.props.modalHide();
  },

  toggle({type, taskId, mention}){
    // type == 'complete' || 'related'
    const toggleField = (type1, type2) => {
      const value = mention ? !mention[type1] : true;
      if(value){
        this.props.dispatch(actions.change(`${this.props.mentionsModel}.${taskId}.${type1}`, value))
        this.props.dispatch(actions.change(`${this.props.mentionsModel}.${taskId}.${type2}`, !value))
      }
      else{
        this.props.dispatch(actions.change(`${this.props.mentionsModel}.${taskId}.${type1}`, value))
      }
    }
    return type == 'complete' ? toggleField('complete', 'related') : toggleField('related', 'complete');
  },

  render() {
    const { tasks, board, mentions, boardModel } = this.props;

    if(!board){
      return <div>Loading</div>
    }

    const filteredBoard = filterBoard(board, tasks, board.searchString);
    const numTasks = getAllTasks(board.data.groups).length;
    const numFilteredTasks = getAllTasks(filteredBoard.data.groups).length;

    return (
      <div className={classes.modal + ' layout-column'}>
        <div className="modal-title">
          Add tasks to a commit:
        </div>
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">{howMany({count: filterMentions(mentions, 'complete').length, adj: 'complete'}, {count: filterMentions(mentions, 'related').length, adj: 'related'}, 'task')}</div>
          <div className={classes.search}>
            <Input 
              model={`${boardModel}.searchString`}
              value={board.searchString}
              className="dr-input" 
              placeholder="Search tasks"
            />
            <PopoverMenu preferPlace="right" trigger="hoverDelay">
              <MdSearch size="20"/>
              <div><TasksFilterMenu model={`${boardModel}.searchString`} value={board.searchString}/></div>
            </PopoverMenu>
          </div>
        </div>
        {
          numTasks == 0 || numFilteredTasks == 0 ?
          <div className="flex layout-column layout-align-center-center text-center">
            {numTasks == 0
              ? <div style={{width: '100%'}}>This project has no tasks. Add some.</div>
              : <div style={{width: '100%'}}>No results, <a className="text-primary" onClick={()=>this.props.dispatch(actions.change(`${boardModel}.searchString`, ''))}>clear search filter.</a></div>
            }
          </div> :
          <div className="flex scroll-box">
            {filteredBoard.data.groups.map(group => <div>
              {group.tasks.map(taskId => <TaskRow
                key={taskId}
                taskId={taskId}
                mention={mentions[taskId]}
                toggleComplete={()=>this.toggle({type: 'complete',taskId, mention: mentions[taskId]})}
                toggleRelated={()=>this.toggle({type: 'related',taskId, mention: mentions[taskId]})}
              />
              )}
            </div>)}
          </div>
        }
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex text-description-1"></div>
          <Button style={{marginRight: '10px'}} onClick={this.cancel}>Cancel</Button>
          <Button className="primary" onClick={this.submit}>Add Tasks</Button>
        </div>
      </div>
    )
  }
});

function filterMentions(mentions, type){
  const mentionsArray = mentions ? Object.keys(mentions).map(taskId => mentions[taskId]) : [];
  // type == 'complete' || 'related'
  return mentionsArray.length > 0 ? mentionsArray.filter( mention => mention[type]) : []
}

function getMentionsFromObject(mentionsObject, tasks){
  const mentions = [];
  Object.keys(mentionsObject).forEach(taskId => {
    if(mentionsObject[taskId].complete){
      mentions.push(newMention({entityId: taskId, display: tasks[taskId].data.name, mentionType: 'task-complete'}))
    }
    else if(mentionsObject[taskId].related){
      mentions.push(newMention({entityId: taskId, display: tasks[taskId].data.name, mentionType: 'task'}))
    }
  })
  return mentions;
}

function newMention({entityId, display, mentionType}){
  return {
    entityId,
    display,
    mentionType,
    mentionId: getUuid()
  }
}

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks, mentions }, {projectId}) {
  const projectBoards = tasks.projects && tasks.projects[projectId] ? tasks.projects[projectId].boards : null;
  const board = projectBoards ? tasks.boards[projectBoards[0]] : {};
  return {
    tasks: tasks.data,
    board: board,
    boardModel: board && board.data && board.data._id ? `tasks.boards.${board.data._id}` : '',
    mentions: mentions.tasks[projectId] || {},
    mentionsModel: `mentions.tasks.${projectId}`,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);