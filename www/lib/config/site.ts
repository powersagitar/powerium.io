import { Metadata } from 'next';

export type SiteConfig = {
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
    icons?: Metadata['icons'];
    openGraph: {
      titleLength: number;
      descriptionLength: number;
    };
  };

  githubRepository?: `${string}/${string}`;
};
