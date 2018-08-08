import React from 'react';
import { waitAll } from 'folktale/concurrency/task';

import { get } from '@/packages/cmd';
import Input from '@/ui/components/Input';

import './Home.css';

const objNotEmpty = obj => Object.keys(obj).length > 1;

class Home extends React.Component {
  state = {
    profileDetails: [],
    username: ''
  };

  inputRef: React.RefObject<HTMLInputElement> = React.createRef();

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
        <form className="form" onSubmit={this.fetchGithubDetails}>
          <div className="flex-down">
            <legend className="legend">Search for a developer</legend>
            <div className="input-wrapper">
              <Input
                className="inputField"
                id="gh-username"
                label="Github username"
                ref={this.inputRef}
                onChange={this.updateUsername}
              />
            </div>
            <button className="searchButton" type="submit">
              Search
            </button>
          </div>
        </form>
        {!this.state.profileDetails
          ? null
          : this.state.profileDetails.map((langData, i) => (
              <div key={i} className="languageContainer">
                {Object.entries(langData).map((lang, i) => (
                  <div key={i}>
                    <p>{`${lang[0]} ${lang[1]}`}</p>
                  </div>
                ))}
                <p>
                  Total bytes:{' '}
                  {Object.values(langData).reduce((acc: number, curr: number) => acc + curr, 0)}
                </p>
              </div>
            ))}
      </div>
    );
  }
}

export default Home;
