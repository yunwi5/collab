import Chance from 'chance';
const chance = new Chance();

export const CREATE_USER_OPERATION_NAME = 'CreateUser';

export const CREATE_USER_MUTATION = `
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      userId
      username
      email
    }
  }
`;

export const generateCreateUserVariables = () => {
  return {
    createUserInput: {
      username: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 8 }),
    },
  };
};
