const authConfig = {
  providers: [
    {
      // Primary production issuer for diceministry.org
      domain: 'https://clerk.diceministry.org',
      applicationID: 'convex',
    },
    {
      // Support for cases where Clerk might use the domain as the audience
      domain: 'https://clerk.diceministry.org',
      applicationID: 'clerk.diceministry.org',
    },
    {
      // Support for cases where Clerk might use the full URL as the audience
      domain: 'https://clerk.diceministry.org',
      applicationID: 'https://clerk.diceministry.org',
    },
    {
      // Support for potential trailing slash in issuer claim
      domain: 'https://clerk.diceministry.org/',
      applicationID: 'convex',
    },
    // Dynamic provider based on environment variables
    ...(process.env.CLERK_ISSUER_URL || process.env.CLERK_JWT_ISSUER_DOMAIN
      ? [
          {
            domain: (process.env.CLERK_ISSUER_URL || process.env.CLERK_JWT_ISSUER_DOMAIN)!
              .trim()
              .replace(/^(?!https?:\/\/)/, 'https://')
              .replace(/\/$/, ''),
            applicationID: 'convex',
          },
        ]
      : []),
  ],
};

export default authConfig;
