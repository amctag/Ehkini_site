export function handlePosts({ url, method }) {
  if ((url === "/posts" || url === "posts") && method === "POST") {
    return {
      data: {
        message: "Post published successfully."
      }
    };
  }

  return null;
}
