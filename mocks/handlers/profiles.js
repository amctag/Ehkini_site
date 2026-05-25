import { mockProfilesBySlug } from "@/mocks/data/profiles/by-slug";

export function handleProfiles({ url, method }) {
  if (
    (url === "/profile/phone/send-otp-new" || url === "profile/phone/send-otp-new") &&
    method === "POST"
  ) {
    return {
      data: {
        message: "OTP sent successfully."
      }
    };
  }

  if (
    (url === "/profile/phone/confirm-new" || url === "profile/phone/confirm-new") &&
    method === "POST"
  ) {
    return {
      data: {
        message: "Phone number updated successfully."
      }
    };
  }

  if ((url === "/profile/update" || url === "profile/update") && method === "POST") {
    return {
      data: {
        message: "Profile updated successfully."
      }
    };
  }

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
