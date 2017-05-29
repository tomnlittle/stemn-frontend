import React, { Component } from 'react';
import classNames from 'classnames';
import classes from './TaskMentionModal.css';
import howMany from 'stemn-shared/utils/strings/howMany.js';
import Input from 'stemn-shared/misc/Input/Input/Input';
import Button from 'stemn-shared/misc/Buttons/Button/Button';
import TaskRow from './TaskRow/TaskRow.jsx';
import MdSearch from 'react-icons/md/search';
import { filterBoard, getAllTasks } from 'stemn-shared/misc/Tasks/Tasks.utils.js';
import TasksFilterMenu from 'stemn-shared/misc/Tasks/TasksFilterMenu/TasksFilterMenu.jsx';
import Popover from 'stemn-shared/misc/Popover';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';

export default class TaskMentionModal extends Component {
  onMount(nextProps, prevProps) {
    if(!nextProps.board || !nextProps.board.data){
      nextProps.getBoards({projectId: nextProps.projectId})
    }
  }
  componentWillMount() { this.onMount(this.props) }
  submit(){
    // Get the mentions
    const mentions = getMentionsFromObject(this.props.mentions, this.props.tasks);
    // Clear props.mentions;
    this.props.storeChange(this.props.mentionsModel, {})

    this.props.modalConfirm({mentions});
  }
  cancel(){
    this.props.modalCancel();
  }

  toggle({type, taskId, mention}){
    // type == 'complete' || 'related'
    const toggleField = (type1, type2) => {
      const value = mention ? !mention[type1] : true;
      if(value){
        this.props.storeChange(`${this.props.mentionsModel}.${taskId}.${type1}`, value)
        this.props.storeChange(`${this.props.mentionsModel}.${taskId}.${type2}`, !value)
      }
      else{
        this.props.storeChange(`${this.props.mentionsModel}.${taskId}.${type1}`, value)
      }
    }
    return type == 'complete' ? toggleField('complete', 'related') : toggleField('related', 'complete');
  }

  render() {
    const { tasks, board, mentions, boardModel } = this.props;

    const getTasks = () => {
      const filteredBoard = filterBoard(board, tasks, board.searchString);
      const numTasks = getAllTasks(board.data.groups).length;
      const numFilteredTasks = getAllTasks(filteredBoard.data.groups).length;

      if(numTasks == 0 || numFilteredTasks == 0){
        return (
          <div className="flex layout-column layout-align-center-center text-center">
            {numTasks == 0
              ? <div style={{width: '100%'}}>This project has no tasks. Add some.</div>
              : <div style={{width: '100%'}}>No results, <a className="text-primary" onClick={() => this.props.storeChange(`${boardModel}.searchString`, '')}>clear search filter.</a></div>
            }
          </div>
        )
      }
      else{
        return (
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
        )
      }
    }

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
            <Popover preferPlace="right" trigger="hoverDelay">
              <MdSearch size="20"/>
              <div><TasksFilterMenu model={`${boardModel}.searchString`} value={board.searchString}/></div>
            </Popover>
          </div>
        </div>
        <div className="layout-column flex rel-box">
          <LoadingOverlay show={!board || !board.data} />
          { board && board.data ? getTasks() : null }
        </div>
        <div className="modal-footer layout-row layout-align-start-center">
          <div className="flex text-description-1"></div>
          <Button style={{marginRight: '10px'}} onClick={this.cancel}>Cancel</Button>
          <Button className="primary" onClick={this.submit}>Add Tasks</Button>
        </div>
      </div>
    )
  }
}

function filterMentions(mentions, type){
  const mentionsArray = mentions ? Object.keys(mentions).map(taskId => mentions[taskId]) : [];
  // type == 'complete' || 'related'
  return mentionsArray.length > 0 ? mentionsArray.filter( mention => mention[type]) : []
}

function getMentionsFromObject(mentionsObject, tasks){
  const mentions = [];
  Object.keys(mentionsObject).forEach(taskId => {
    if (mentionsObject[taskId].complete){
      mentions.push(
        newMention({
          entityId: taskId,
          display: tasks[taskId].data.name,
          mentionType: 'task-complete'
        })
      )
    } else if (mentionsObject[taskId].related){
      mentions.push(
        newMention({
          entityId: taskId,
          display: tasks[taskId].data.name,
          mentionType: 'task'
        })
      )
    }
  })
  return mentions;
}
