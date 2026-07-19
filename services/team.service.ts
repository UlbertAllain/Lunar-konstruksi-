import {
  createTeamMember,
  deleteTeamMember,
  getTeamMemberById,
  getTeamMembers,
  updateTeamMember,
} from "@/repositories/team.repository";
import { deleteImagesSafely } from "@/services/upload.service";
import { teamSchema } from "@/validators/team.validator";

export async function createTeamData(payload: unknown) {
  return createTeamMember(teamSchema.parse(payload));
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

  return updated;
}

export async function removeTeam(id: string) {
  const previous = await getTeamMemberById(id);
  if (!previous) return false;

  const deleted = await deleteTeamMember(id);
  if (deleted) await deleteImagesSafely([previous.photo.publicId]);
  return deleted;
}
