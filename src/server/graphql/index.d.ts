declare module '*.graphql' {
  import { DocumentNode } from 'graphql/language';

  const value: DocumentNode;
  export = value;
}
