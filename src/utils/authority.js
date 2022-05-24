import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority() {
  const authorityString = localStorage.getItem('authority')

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  return authority;
}
export function setAuthority(authority) {
  localStorage.setItem('authority', JSON.stringify(authority)); // auto reload

  reloadAuthorized();
}
