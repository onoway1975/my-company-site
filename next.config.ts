import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    optimizeCss: true,
  },
  // 画像最適化
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.st-note.com",
      },
      {
        protocol: "https",
        hostname: "d2l930y2yx77uc.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "**.replicate.com",
      },
    ],
  },
  // 本番ビルドでconsole.logを除去
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    const productionOnly =
      process.env.NODE_ENV === "production"
        ? [
            // 本番環境では /demo を非公開にする
            { source: "/demo", destination: "/", permanent: false },
            { source: "/demo/:path*", destination: "/", permanent: false },
          ]
        : [];

    return [
      ...productionOnly,
      // 旧URLの404対策
      {
        source: "/works/good-design-award-2024",
        destination: "/works/",
        permanent: true,
      },
      {
        source: "/works/good-design-award-2024/",
        destination: "/works/",
        permanent: true,
      },
      {
        source: "/works/studio-brand-identity",
        destination: "/works/",
        permanent: true,
      },
      {
        source: "/works/studio-brand-identity/",
        destination: "/works/",
        permanent: true,
      },
    ];
  },
  // HTTPヘッダー（キャッシュ設定）
  async headers() {
    return [
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/videos/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
