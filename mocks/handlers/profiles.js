import { mockProfilesBySlug } from "@/mocks/data/profiles/by-slug";

export function handleProfiles({ url, method }) {
  if (method !== "GET") return null;

  const match = url.match(/^\/profiles\/([^/]+)$/);
  if (!match) return null;

  const slug = match[1].toLowerCase();
  const profile = mockProfilesBySlug[slug];

  if (!profile) {
    return {
      error: { status: 404, data: { message: "Profile not found" } }
    };
  }

  return { data: profile };
}
