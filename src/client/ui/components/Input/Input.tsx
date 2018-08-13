import React, { Fragment, forwardRef } from 'react';

interface PInput {
  id: string;
  label: string;
  validationMsg?: string;
  onChange?: (e) => void;
}

export const Input: React.SFC<PInput & React.HTMLProps<HTMLInputElement>> = forwardRef(
  ({ id, label, onChange, ...domProps }, ref) => {
    return (
      <Fragment>
        {<label htmlFor={id}>{label}</label>}
        <input {...domProps} autoComplete="off" id={id} ref={ref} onChange={onChange} />
      </Fragment>
    );
  }
);
export default Input;
