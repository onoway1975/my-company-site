import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "花束が届いています | flower mail",
    description: "flower mail で花束が届いています。",
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: "花束が届いています",
      description: "flower mail から、花束が届いています。",
      url: `https://ciraf.jp/flowermail/${id}`,
      images: [
        {
          url: "https://ciraf.jp/flowermail/ogp.jpg",
          width: 1200,
          height: 630,
          alt: "flower mail",
        },
      ],
    },
  };
}

export default function FlowermailReceiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
