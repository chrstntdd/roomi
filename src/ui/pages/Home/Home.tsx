import React from 'react';
import { waitAll } from 'folktale/concurrency/task';

import { get } from '@/packages/fetch/cmd';

import Input from '@/ui/components/Input';

const objNotEmpty = obj => Object.keys(obj).length > 1;

class Home extends React.Component {
  state = {
    profileDetails: [],
    username: ''
  };

  inputRef = React.createRef();

  fetchGithubDetails = e => {
    e.preventDefault();
    get(`https://api.github.com/users/${this.state.username}`)
      .chain(profile => get(profile.repos_url))
      .chain(repos => waitAll(repos.map(repo => get(repo.languages_url)).slice(0, 5)))
      .run()
      .listen({
        onResolved: data => {
          this.setState({ profileDetails: data.filter(objNotEmpty) });
        },
        onRejected: err => console.warn(err)
      });
  };

  updateUsername = e => {
    const username = e.target.value;
    this.setState({ username });
  };

  render() {
    return (
      <div className="home">
        Home
        <form onSubmit={this.fetchGithubDetails}>
          <Input label="Github username" ref={this.inputRef} onChange={this.updateUsername} />
          <button type="submit">Search</button>
        </form>
        {!this.state.profileDetails
          ? null
          : this.state.profileDetails.map((x, i) => {
              console.log(x);
              return <div key={i}>something</div>;
            })}
      </div>
    );
  }
}

export default Home;
