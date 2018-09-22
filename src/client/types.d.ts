type GenericObject = { [key: string]: any };

type RootState = {
  readonly email: string;
  readonly firstName: string;
  readonly friends: any[];
  readonly graphQlErrorMsg: string;
  readonly isAuthenticated: boolean;
  readonly jwt: string;
  readonly lastName: string;
  readonly lists: any[];
  readonly role: string;
};
