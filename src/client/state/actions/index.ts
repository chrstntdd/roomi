import { GlobalStore, RootState } from '../store';

export type Sync = {
  setWindowWidth: (state: RootState, { windowWidth: number }) => void;
};

export default (store: GlobalStore): Sync => ({
  setWindowWidth: (_, { windowWidth }) => {
    store.setState({ windowWidth });
  }
});
