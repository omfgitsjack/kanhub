import React from 'react';
import ReactTooltip from 'react-tooltip';

const TooltipLabel = (props) => {
  return (
    <div>
      <label className="tooltip-label" data-tip data-for='tooltip-tip'>{props.label}</label>
      <ReactTooltip id='tooltip-tip' place='top' effect='solid'>
        <div className="tooltip-text">
          {props.children}
        </div>
      </ReactTooltip>
    </div>
  );
};

export default TooltipLabel;