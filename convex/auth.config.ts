const issuerUrls = [
  // Production Clerk issuer. The Convex JWT template logs aud: "convex".
  'https://clerk.diceministry.org',
  // Development Clerk issuer used by the local/dev Convex deployment.
  'https://inspired-duck-53.clerk.accounts.dev',
];

const authConfig = {
  providers: issuerUrls.map((domain) => ({
    domain,
    applicationID: 'convex',
  })),
};

export default authConfig;
