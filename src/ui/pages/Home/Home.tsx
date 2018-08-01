import React from 'react';
import { waitAll } from 'folktale/concurrency/task';

import { get } from '@/packages/cmd';

import Input from '@/ui/components/Input';

const objNotEmpty = obj => Object.keys(obj).length > 1;

import s from './Home.css';

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
        <form className={s.form} onSubmit={this.fetchGithubDetails}>
          <div className="flex-down">
            <legend className={s.legend}>Search for a developer</legend>
            <div className="input-wrapper">
              <Input
                className={s.inputField}
                id="gh-username"
                label="Github username"
                ref={this.inputRef}
                onChange={this.updateUsername}
              />
            </div>
            <button className={s.searchButton} type="submit">
              Search
            </button>
          </div>
        </form>
        {!this.state.profileDetails
          ? null
          : this.state.profileDetails.map((langData, i) => (
              <div key={i} className={s.languageContainer}>
                {Object.entries(langData).map((lang, i) => (
                  <div key={i}>
                    <p>{`${lang[0]} ${lang[1]}`}</p>
                  </div>
                ))}
                <p>Total bytes: {Object.values(langData).reduce((acc, curr) => acc + curr, 0)}</p>
              </div>
            ))}
      </div>
    );
  }
}

export default Home;
