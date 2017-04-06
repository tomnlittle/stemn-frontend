import React, { Component, PropTypes } from 'react';

import classes from './UserDetails.css';
import classNames from 'classnames';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import { Link } from 'react-router';


class EducationItem extends Component {
  render() {
    const { item } = this.props;
    
    const organisation = item.organisations[0] 
      ? item.organisations[0].name
      : item.school;
    
    return (
      <div className={ classes.item }>
        <div className='layout-row layout-align-start-center'>
          <div className='flex'>
            <div className={ classes.main +' text-mini-caps'}>
              <span>{ item.degree }</span>
              { item.degree && item.fieldOfStudy 
              ? <span className='text-interpunct' />
              : null }              
              <span>{ item.fieldOfStudy }</span>
            </div>
            <div className={ classes.sub +' text-mini-caps'}>
              <span>{ organisation }</span>
              <span className='text-interpunct'></span>
              <span>{ item.startDate.year } - { item.isCurrent ? 'Current' : item.endDate.year }</span>
            </div>
          </div>
          { item.organisations[0]
          ? <Link to='/'>
              <UserAvatar 
                name={ item.organisations[0].name }
                picture={ item.organisations[0].picture }
                shape='square'
                display='contain'
                size={35}
              />
            </Link>
          : null }
        </div>
        <p className={ classes.notes }>
          { item.notes }
        </p>
      </div>
    )
  }
}

class ExperienceItem extends Component {
  render() {
    const { item } = this.props;
    const company = item.organisations[0] 
      ? item.organisations[0].name
      : item.company;
    
    return (
      <div className={ classes.item }>
        <div className='layout-row layout-align-start-center'>
          <div className='flex'>
            <div className={ classes.main +' text-mini-caps'}>
              <span>{ item.position }</span>
              { item.position && company 
              ? <span className='text-interpunct' />
              : null }
              <span>{ company }</span>
            </div>
            <div className={ classes.sub +' text-mini-caps'}>
              <span>{ item.startDate.year } - { item.isCurrent ? 'Current' : item.endDate.year }</span>
            </div>
          </div>
          { item.organisations[0]
          ? <Link to='/'>
              <UserAvatar 
                name={ item.organisations[0].name }
                picture={ item.organisations[0].picture }
                shape='square'
                display='contain'
                size={35}
              />
            </Link>
          : null }
        </div>
        <p className={ classes.notes }>
          { item.notes }
        </p>
      </div>
    )
  }
}

export default class UserDetails extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        <div className='text-mini-caps'>Education</div>
        <br />
        <InfoPanel>
          { user.data.profile.profileDetails.education.map((item) => (
            <EducationItem key={ item._id } item={ item } />
          ))}
        </InfoPanel>        
        <br />
        <div className='text-mini-caps'>Experience</div>
        <br />
        <InfoPanel>
          { user.data.profile.profileDetails.experience.map((item) => (
            <ExperienceItem key={ item._id } item={ item } />
          ))}
        </InfoPanel>
      </div>
    )
  }
}