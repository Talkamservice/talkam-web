export const IsRole = ({ currentRole, allowedRoles, children }) => {

  return allowedRoles?.find((role) => currentRole?.includes(role)) ? (
    children
  ) : null;
};