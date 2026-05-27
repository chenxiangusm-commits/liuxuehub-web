import { getAllSchools } from "@/lib/data.server";
import SchoolsClient from "./SchoolsClient";

export const dynamic = "force-dynamic";

export default async function SchoolsPage() {
  const schools = await getAllSchools();

  return (
    <main>
      <SchoolsClient schools={schools} />
    </main>
  );
}
