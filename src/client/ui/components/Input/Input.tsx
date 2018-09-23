import React, { PureComponent } from 'react';

import { classNames } from '@/util';

interface PInput {
  id: string;
  label: string;
  value: string;
  validator: any;
  validationMsg?: string;
  isValid?: boolean;
  onChange?: (e) => void;
}

interface SInput {
  isValid: boolean;
  validationMsg: string | null;
}

/**
 * @description
 * **UNCONTROLLED** Input with a label. Value prop is not
 * added to the <input> element.
 */
export class Input extends PureComponent<PInput & React.HTMLProps<HTMLInputElement>, SInput> {
  constructor(props) {
    super(props);
  }

  state = {
    isValid: false,
    validationMsg: null
  };

  handleBlur = e => {
    if (this.props.validator) {
      this.props.validator(this.props.value).matchWith({
        Success: _ => this.setState({ isValid: true, validationMsg: '' }),
        Failure: ({ value }) => this.setState({ isValid: false, validationMsg: value })
      });
    }
  };

  render() {
    const { id, label, onChange, value, className, type, validator, ...domProps } = this.props;
    const { isValid, validationMsg } = this.state;

    const hasContent = value !== '';

    return (
      <div className="input-group">
        <input
          type={type}
          className={classNames([
            className,
            hasContent && 'has-content',
            validationMsg && 'invalid'
          ])}
          autoComplete="off"
          id={id}
          onChange={onChange}
          onBlur={this.handleBlur}
          {...domProps}
        />
        {<label htmlFor={id}>{label}</label>}
        {!isValid &&
          validationMsg && (
            <div className="errors">
              {Array.isArray(validationMsg) ? (
                // for mobile, only display one error message at a time
                validationMsg.slice(0, 1).map((msg, i) => <span key={i}>{msg}</span>)
              ) : (
                <span>{validationMsg}</span>
              )}
            </div>
          )}
      </div>
    );
  }
}

export default Input;
