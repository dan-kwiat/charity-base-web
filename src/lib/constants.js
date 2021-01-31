const charityBaseGqlApiUri = process.env.REACT_APP_CB_API_URL
const charityBaseGqlAuthUri = process.env.REACT_APP_CB_AUTH_URL
const charityBaseApiKey = process.env.REACT_APP_CHARITY_BASE_API_KEY

const auth0Config = {
  audience: "https://charitybase.uk/api",
  domain: "charity-base.eu.auth0.com",
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  redirectUri: process.env.REACT_APP_URL,
  responseType: "token id_token",
  scope: "openid profile email edit:apikeys",
}

const mapBoxToken = process.env.REACT_APP_MAPBOX_TOKEN

export {
  charityBaseApiKey,
  charityBaseGqlApiUri,
  charityBaseGqlAuthUri,
  auth0Config,
  mapBoxToken,
}
