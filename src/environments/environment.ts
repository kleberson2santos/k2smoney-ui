export const environment = {
  production: false,
  apiUrl: "http://localhost:8080",
  tokenAllowedDomains: [/localhost:8080/],
  tokenDisallowedRoutes: [/\/oauth2\/token/],
  oauthCallbackUrl: "http://local-k2smoney.com:8000/authorized",
  logoutRedirectToUrl: "http://local-k2smoney.com:8000",
};
