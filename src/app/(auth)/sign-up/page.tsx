import { getCurrent, SignUpCard } from "@/features";
import { redirect } from "next/navigation";


export default async function SingUp () {

  const user = await getCurrent();
  if (user) redirect("/")
    
  return (
    <SignUpCard />
  );
}