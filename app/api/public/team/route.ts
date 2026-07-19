import { routeError, success } from "@/lib/route-response";
import { getActiveTeamMembers } from "@/repositories/team.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getActiveTeamMembers());
  } catch (error) {
    return routeError(error, "Gagal memuat tim.");
  }
}
