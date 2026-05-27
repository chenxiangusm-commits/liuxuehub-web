import { getAllPrograms } from "@/lib/data.server";
import FavoritesClient from "./FavoritesClient";

export default async function FavoritesPage() {
  const allPrograms = await getAllPrograms();

  return <FavoritesClient allPrograms={allPrograms} />;
}
