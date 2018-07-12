import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

import cn from 'classnames'
import classes from '../DatePicker/DatePicker.css'
import Calendar from '../Calendar.jsx'
import PopoverFit from 'stemn-shared/misc/PopoverMenu/PopoverFit'
import MdExpandMore from 'react-icons/md/expand-more'
import MdClose from 'react-icons/md/close'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

export class Component extends React.Component {
  static propTypes = {
    menuOptions: PropTypes.object,
  }

  state = {
    viewDate: moment(),
    calendarIsOpen: false,
  };

  toggleCalendar = (openStatus) => {
    const isOpen = openStatus === undefined
      ? !this.state.calendarIsOpen
      : openStatus

    this.setState({ calendarIsOpen: isOpen })
  };

  selectDate = (date) => {
    const newDate = date ? date.format() : ''
    this.props.dispatch(storeChange(this.props.model, newDate))

    if (this.props.onChange) {
      this.props.onChange()
    }
  };

  render() {
    const { viewDate, calendarIsOpen } = this.state
    const { value, className, menuOptions, ...otherProps } = this.props

    const valueDate = value ? moment(value) : ''
    const currentTime = moment()

    const options = menuOptions || []
    const filteredOptions = options.filter(option => option.value > currentTime)

    const content = (
      <div className={ classes.popup }>
        { calendarIsOpen
          ? <Calendar
            onNextMonth={ () => this.setState({ viewDate: viewDate.clone().add(1, 'months') }) }
            onPrevMonth={ () => this.setState({ viewDate: viewDate.clone().subtract(1, 'months') }) }
            selectedDate={ valueDate }
            viewDate={ viewDate }
            onPickDate={ this.selectDate }
            renderDay={ day => day.format('D') }
            type="datepicker"
          />
          : filteredOptions.map((option, index) => (
            <a
              key={ index }
              className={ `${classes.fixedOption} layout-row layout-align-start-center` }
              onClick={ () => this.selectDate(option.value) }
            >
              <div className="flex">{ option.name }</div>
              <div className={ classes.fixedOptionTime }>{ option.value.calendar() }</div>
            </a>),
          )}
        <a onClick={ () => this.toggleCalendar() } className={ cn(classes.fixedOption, classes.divider, 'layout-row layout-align-start-center') }>
          <div className="flex">{calendarIsOpen ? 'Simple selector...' : 'Other...'}</div>
        </a>
      </div>
    )

    return (
      <PopoverFit max disableClickClose { ...otherProps } style={ { width: '100%' } }>
        <Button className={ cn('layout-row layout-align-start-center flex rel-box light', className) } style={ { width: '100%' } }>
          { valueDate ? valueDate.calendar() : 'Select a due date' }
          <div className="flex" />
          { valueDate &&
            <MdClose onClick={ () => this.selectDate() } style={ { marginLeft: '5px' } } size={ 12 } /> }
          <MdExpandMore style={ { marginLeft: '5px' } } size={ 15 } />
        </Button>
        { content }
      </PopoverFit>
    )
  }
}


export default connect()(Component)
