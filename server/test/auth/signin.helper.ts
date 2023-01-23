export const SIGN_IN_OPERATION_NAME = 'SignIn';

export const SIGN_IN_MUTATION = `
    mutation SignIn($signInInput: SignInInput!) {
        signIn(signInInput: $signInInput) {
            access_token,
            user {
                userId,
                displayName,
                email
            }
        }
    }
`;
