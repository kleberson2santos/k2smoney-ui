export const environment = {
  production: true,
  apiUrl: "https://k2smoney-api.herokuapp.com",
  tokenAllowedDomains: [/k2smoney-api.herokuapp.com/],
  tokenDisallowedRoutes: [/\/oauth2\/token/],
  oauthCallbackUrl: "https://k2smoney-angular.herokuapp.com/authorized",
  logoutRedirectToUrl: "https://k2smoney-angular.herokuapp.com",

  // apiUrl: 'http://localhost:8080',
  // tokenAllowedDomains: [/localhost:8080/],
  // tokenDisallowedRoutes: [/\/oauth\/token/],
  // oauthCallbackUrl: 'https://oidcdebugger.com/debug',
  // logoutRedirectToUrl: 'http://local-k2smoney.com:8000'
};
