import React, { forwardRef } from 'react';

import { classNames } from '@/util';

interface PInput {
  id: string;
  label: string;
  validationMsg?: string;
  onChange?: (e) => void;
}

/**
 * @description
 * **UNCONTROLLED** Input with a label. Value prop is not
 * added to the <input> element.
 */
export const Input: React.SFC<PInput & React.HTMLProps<HTMLInputElement>> = forwardRef(
  ({ id, label, onChange, value, className, type }, ref) => (
    <div className="input-group">
      <input
        type={type}
        className={classNames([className, value !== '' && 'has-content'])}
        autoComplete="off"
        id={id}
        ref={ref}
        onChange={onChange}
      />
      {<label htmlFor={id}>{label}</label>}
    </div>
  )
);
export default Input;
