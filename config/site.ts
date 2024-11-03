import { SiteConfig } from '@/lib/config/site';

export const siteConfig: SiteConfig = {
  // URL 관련 정보 설정
  url: {
    protocol: 'https',                // 사이트의 프로토콜 설정
    hostname: 'www.zeonjiho.io',      // 사이트의 호스트 이름
    origin: 'https://www.zeonjiho.io', // 사이트의 전체 URL
  },

  // 메타데이터 설정
  metadata: {
    author: { 
      name: 'zeonjiho',              // 사이트 저자의 이름
      url: '/about'                  // 저자에 대한 정보 페이지 경로
    },
    title: 'zeonjiho.io',            // 사이트 제목
    description:                     // 사이트 설명
      "@zeonjiho's blog about CGI development, productivity, and many more.",
  },

  // GitHub 저장소 정보
  githubRepository: 'zeonjiho/zeonjiho_blog',  // GitHub 저장소의 경로
};
