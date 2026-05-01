import ArtworkGrid from "@/components/artworks/ArtworkGrid";

export default function ArtworksPage({ searchParams }) {
  const type = searchParams?.type ?? null;

  return (
    <main>
      <ArtworkGrid type={type} />
    </main>
  );
}
