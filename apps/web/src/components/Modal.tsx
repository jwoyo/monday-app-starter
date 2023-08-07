import React, {ReactElement} from 'react';
import {modalCss} from './Modal.css.ts';
import {Heading} from 'monday-ui-react-core';

type Props = {children: ReactElement, headline: string};

export function Modal({children, headline}: Props) {
  return (
    <div className={modalCss}>
      <Heading value={headline} size={Heading.sizes.MEDIUM}></Heading>
      <div>
        {children}
      </div>
    </div>
  );
}

