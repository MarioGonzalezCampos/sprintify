import { getCurrent, SignInCard } from "@/features";
import { redirect } from "next/navigation";


const SingIn = async () => {

  const user = await getCurrent();
  if (user) redirect("/")

  return <SignInCard />;
}

export default SingIn;
