export type SiteConfig = {
  name: string;

  url: {
    protocol: 'http' | 'https';
    hostname: string;
    origin: `${'http' | 'https'}://${string}`;
  };

  metadata: {
    author: { name: string; url?: string };
    title: string;
    description: string;
    keywords?: string[];
  };

  githubRepository?: `${string}/${string}`;
};
