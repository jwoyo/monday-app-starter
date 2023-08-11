import React, {ReactElement} from 'react';
import {
  modalBodyCss,
  modalCss, modalFooterControlsContainerCss,
  modalFooterControlsCss,
  modalFooterCss,
  modalHeaderCss,
} from './Modal.css.ts';
import {Divider, Heading} from 'monday-ui-react-core';

type Props = {children: ReactElement, controls?: ReactElement, secondaryControls?: ReactElement, headline: string};

export function Modal({children, controls, secondaryControls, headline}: Props) {
  return (
    <div className={modalCss}>
      <div className={modalHeaderCss}>
        <Heading value={headline}
          size={Heading.sizes.MEDIUM}></Heading>
        <Divider/>
      </div>
      <div className={modalBodyCss}>
        {children}
      </div>
      {controls ? <div className={modalFooterCss}>
        <Divider/>
        <div className={modalFooterControlsContainerCss}>
          {<div>
            {secondaryControls ? secondaryControls : <></>}
          </div>}
          { controls && <div className={modalFooterControlsCss}>
            <div>
              {controls}
            </div>
          </div> }
        </div>
      </div> : <></>}
    </div>
  );
}


