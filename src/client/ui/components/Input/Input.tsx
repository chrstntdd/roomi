import React, { PureComponent } from 'react';

import { AsyncValidator } from '@/state/fetches';

import { classNames } from '@/util';

interface PInput {
  id: string;
  label: string;
  value: string;
  validator: any;
  asyncValidator: () => Promise<AsyncValidator>[];
  validationMsg?: string;
  isValid?: boolean;
  onChange?: (e) => void;
}

interface SInput {
  isValid: boolean;
  validationMsg?: string[];
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
    validationMsg: []
  };

  handleBlur = async e => {
    const val = (this.props.value || '').trim();

    if (this.props.validator) {
      this.props.validator(val).matchWith({
        Success: _ => this.setState({ isValid: true, validationMsg: [] }),
        Failure: ({ value }) => this.setState({ isValid: false, validationMsg: value })
      });
    }

    if (this.props.asyncValidator && val && val.length) {
      const res = await Promise.all(this.props.asyncValidator());

      if (res.every(v => v.isValid)) {
        this.setState({ isValid: true });
      } else {
        this.setState(prevState => ({
          isValid: false,
          validationMsg: prevState.validationMsg
            ? prevState.validationMsg.concat(res[0].msg)
            : [res[0].msg]
        }));
      }
    }
  };

  render() {
    const {
      id,
      label,
      onChange,
      value,
      className,
      type,
      validator,
      asyncValidator,
      ...domProps
    } = this.props;
    const { isValid, validationMsg } = this.state;

    const hasContent = value !== '';
    const hasValidationMsgs = validationMsg && validationMsg.length;

    return (
      <div className="input-group">
        <input
          type={type}
          className={classNames([
            className,
            hasContent && 'has-content',
            hasValidationMsgs && 'invalid'
          ])}
          autoComplete="off"
          id={id}
          onChange={onChange}
          onBlur={this.handleBlur}
          {...domProps}
        />
        <label htmlFor={id}>{label}</label>
        {!isValid && validationMsg && (
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
