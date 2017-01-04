import React from 'react';

// Components
import { Link } from 'react-router';

// Styles
import classNames from 'classnames';
import classes from './SimpleIconButton.css'

export default class extends React.Component{
  render() {
    const { style, onClick, onContextMenu, title, className, color, to, activeClassName } = this.props
    if(to){
      return (
        <Link className={classNames( classes.button, className, {[classes.white] : color == 'white'})}
          activeClassName={activeClassName}
          to={to}
          style={style}
          onClick={onClick}
          title={title}
          onContextMenu={onContextMenu}>
          {this.props.children}
        </Link>
      );
    }
    else{
      return (
        <button className={classNames( classes.button, className, {[classes.white] : color == 'white'})}
         style={style}
          onClick={onClick}
          title={title}
          onContextMenu={onContextMenu}>
          {this.props.children}
        </button>
      );

    }
  }
};