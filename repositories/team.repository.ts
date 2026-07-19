import type { TeamMember } from "@/types/team";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  listDocuments,
  updateDocument,
} from "./base.repository";

const COLLECTION = "team";

function sortTeam(items: TeamMember[]) {
  return items.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function createTeamMember(data: TeamMember) {
  return createDocument<TeamMember>(COLLECTION, data);
}

export async function getTeamMembers() {
  return sortTeam(await listDocuments<TeamMember>(COLLECTION));
}

export async function getActiveTeamMembers() {
  return sortTeam(
    (await listDocuments<TeamMember>(COLLECTION)).filter((item) => item.isActive),
  );
}

export function getTeamMemberById(id: string) {
  return getDocumentById<TeamMember>(COLLECTION, id);
}

export function updateTeamMember(id: string, data: Partial<TeamMember>) {
  return updateDocument<TeamMember>(COLLECTION, id, data);
}

export function deleteTeamMember(id: string) {
  return deleteDocument(COLLECTION, id);
}
