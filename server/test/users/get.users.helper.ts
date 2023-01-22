export const GET_USERS_OPERATION_NAME = 'Users';

export const GET_USERS_QUERY = `query Users {
    users {
        userId
        username
        email
    }
}`;
