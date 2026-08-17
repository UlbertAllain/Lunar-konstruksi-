import {
  createTeamMember,
  deleteTeamMember,
  getTeamMemberById,
  getTeamMembers,
  updateTeamMember,
} from "@/modules/team/team.repository";
import { deleteImagesSafely } from "@/modules/media/upload.service";
import { teamSchema } from "@/modules/team/team.schema";
import { invalidatePublicResource } from "@/modules/public-site/public-cache";

export async function createTeamData(payload: unknown) {
  const created = await createTeamMember(teamSchema.parse(payload));
  invalidatePublicResource("team");
  return created;
}

export function listTeam() {
  return getTeamMembers();
}

export function detailTeam(id: string) {
  return getTeamMemberById(id);
}

export async function updateTeamData(id: string, payload: unknown) {
  const previous = await getTeamMemberById(id);
  if (!previous) return null;

  const data = teamSchema.partial().parse(payload);
  const updated = await updateTeamMember(id, data);

  if (data.photo?.publicId && data.photo.publicId !== previous.photo.publicId) {
    await deleteImagesSafely([previous.photo.publicId]);
  }

  invalidatePublicResource("team");
  return updated;
}

export async function removeTeam(id: string) {
  const previous = await getTeamMemberById(id);
  if (!previous) return false;

  const deleted = await deleteTeamMember(id);
  if (deleted) {
    await deleteImagesSafely([previous.photo.publicId]);
    invalidatePublicResource("team");
  }
  return deleted;
}
