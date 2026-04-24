import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  devIndicators: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
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
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.mzstatic.com",
      },
      {
        protocol: "https",
        hostname: "fal.media",
      },
      {
        protocol: "https",
        hostname: "**.fal.media",
      },
    ],
  },
  // 本番ビルドでconsole.logを除去
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
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
