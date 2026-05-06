const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_ISSUER_URL,
      applicationID: 'convex',
    },
    {
      domain: 'https://clerk.diceministry.org',
      applicationID: 'convex',
    },
  ],
};

export default authConfig;
