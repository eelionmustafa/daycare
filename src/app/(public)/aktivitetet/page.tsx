import { redirect } from "next/navigation";

// "Aktivitetet" u zëvendësua nga "Gjeneratat" — muri i gjeneratave që
// diplomohen çdo pesë vite. Ridrejtimi ruan lidhjet e vjetra/të shpërndara.
export default function ActivitiesRedirect() {
  redirect("/gjeneratat");
}
