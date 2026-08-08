import { routeError, success } from "@/lib/route-response";
import { getActiveTeamMembers } from "@/modules/team/team.repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return success(await getActiveTeamMembers());
  } catch (error) {
    return routeError(error, "Gagal memuat tim.");
  }
}
