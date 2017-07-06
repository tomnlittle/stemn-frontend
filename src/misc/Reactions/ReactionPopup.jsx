import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './Reactions.css';

import Popover from 'stemn-shared/misc/Popover';
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdInsertEmoticon from 'react-icons/md/insert-emoticon';

import { options } from './Reactions.utils.js';


export default React.createClass({
  render(){
    const { submitFn, reactions } = this.props;

    return (
      <Popover preferPlace={this.props.preferPlace}>
        <SimpleIconButton style={{padding: '0'}}>
          <MdInsertEmoticon size="20px" />
        </SimpleIconButton>
        <div className="PopoverMenu" style={ { padding: '5px' } }>
          {options.map(option => <span
            title={option.type}
            onClick={()=>submitFn(option.type)}
            key={option.type}
            className={classes.popupIcon}
           >
           {option.icon}
           </span>)}
        </div>
      </Popover>
    );
  }
});
