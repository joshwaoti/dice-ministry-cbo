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
    {
      domain: 'https://clerk.diceministry.org',
      applicationID: 'clerk.diceministry.org',
    },
    {
      domain: 'https://clerk.diceministry.org',
      applicationID: 'https://clerk.diceministry.org',
    },
  ],
};

export default authConfig;
