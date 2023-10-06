import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "~/pages/_app";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { PackageShow } from "~/pages/dashboard/prompts/[id]";

function RepoPage() {
  const router = useRouter();
  const { username, packagename } = router.query;
  // const packageId = "42487da4-13aa-4f49-9457-1f44fc39cd5d";

  // Use the 'username' and 'repo' values to fetch data or render components
  // Example: Fetch repository details based on 'username' and 'repo' from an API

  return (
    <PackageShow
      username={username as string}
      packagename={packagename as string}
    ></PackageShow>
  );
}

RepoPage.getLayout = getLayout;

export default RepoPage;
