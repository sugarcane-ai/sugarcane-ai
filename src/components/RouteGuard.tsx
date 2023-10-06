// RouteGuard.tsx

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";
import { Session } from "next-auth";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { username, packagename } = router.query;
  console.log(username);
  console.log(packagename);
  const [loading, setLoading] = useState(true); // Add a loading state
  const isPromptPackageRoute = router.pathname.startsWith(
    "/dashboard/prompts/",
  );

  function isValidPublicView(): boolean {
    let output = false;

    if (username && packagename) {
      console.log("valid username and prompt package");
      output = true;
    }

    return output;
  }

  function isValidProtectedView(session: Session | null): boolean {
    let output = false;

    if (isPromptPackageRoute) {
      output = true;
    }

    if (session === null) {
      router.push("/");
    }

    return output;
  }

  if (isValidPublicView() || isValidProtectedView(session)) {
    return <>{children}</>;
  }
}
