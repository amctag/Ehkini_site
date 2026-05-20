import ProfileViewPage from "@/components/ProfileViewPage";

export default async function Page({ params }) {
  const { slug } = await params;
  return <ProfileViewPage slug={slug} />;
}
