const AuthContext = ({req}) => {
    // get the user token from the headers
    const token = req.headers.authorization || '';

    // try to retrieve a user with the token
    const user = getUserWithToken(token);

    // optionally block the user
    // we could also check user roles/permissions here
    if (!user) throw new AuthenticationError('Not Authenticated'); 

    // add the user to the context
    return { user };
}

const getUserWithToken = (token) => {
    if(!token){
        return null;
    }
}