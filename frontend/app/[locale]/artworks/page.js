import ArtworkGrid from "@/components/artworks/ArtworkGrid";

export default async function ArtworksPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type ?? null;

  return (
    <main>
      <ArtworkGrid type={type} />
    </main>
  );
}
