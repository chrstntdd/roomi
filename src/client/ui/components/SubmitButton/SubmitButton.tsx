import React from 'react';

export class SubmitButton extends React.Component<{} & React.HTMLProps<HTMLButtonElement>, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return <button type="submit" {...this.props} />;
  }
}
