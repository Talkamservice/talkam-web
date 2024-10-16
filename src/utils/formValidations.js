let regEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
export const isNotEmpty = (value) => value.trim() !== "" && value;
export const isNotEmptyAndNoSpaces = (value) => value.trim() !== "" && !/\s/.test(value) && value;
export const isNoSpaces = (value) => !/\s/.test(value) && value;
export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const isEmail = (value) => value.trim().includes("@") && regEmail.test(value)
export const isValidPassword = (value) => (isNotEmpty(value) && passwordRegex.test(value))
export const passwordMatcher = (p1, p2) => {
    if (isNotEmpty(p1) && isNotEmpty(p2))
        return p2 === p1;
}
export const confirmPasswordMatches = (password1) => {
    return function checkMatches(password2) {
        if (isNotEmpty(password1) && isNotEmpty(password2))
            return password2 === password1
    };
}
