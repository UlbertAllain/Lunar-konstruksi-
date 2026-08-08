import { headers } from "next/headers";

export async function getBearerToken() {
  const header = (await headers()).get("authorization");

  if (!header) {
    return null;
  }

  return header.replace("Bearer ", "");
}
