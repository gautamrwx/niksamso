// Email Validator
export const emailValidator = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}


// Passowrd Validator
export const passwordValidator = (password) => {
    let isValidPassword;
    let invalidReason;

    if (String(password).length < 6) {
        isValidPassword = false
        invalidReason = 'Password Must Contain Atlest 6 character'
    }
    else {
        isValidPassword = true
        invalidReason = null
    }

    return {
        isValidPassword,
        invalidReason
    }
}