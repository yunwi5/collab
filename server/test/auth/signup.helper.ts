import Chance from 'chance';
const chance = new Chance();

export const SIGN_UP_OPERATION_NAME = 'SignUp';

export const SIGN_UP_MUTATION = `
    mutation SignUp($signUpInput: SignUpInput!) {
        signUp(signUpInput: $signUpInput) {
            userId,
            username,
            displayName,
            email
        }
    }
`;

export const generateSignUpVariables = () => {
  return {
    signUpInput: {
      username: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 8 }),
    },
  };
};

export const generateInvalidSignUpVariables = () => {
  return {
    signUpInput: {
      username: chance.name(),
      email: chance.string(),
      password: chance.string({ length: 3 }),
    },
  };
};
