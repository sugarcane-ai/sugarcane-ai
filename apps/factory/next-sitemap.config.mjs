import { PackageVisibility, PrismaClient } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const prisma =   new PrismaClient({
  log:
    process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

async function fetchPackageData() {
  try {
    const packages = await prisma.promptPackage.findMany({
      where: {
        visibility: PackageVisibility.PUBLIC,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        User: true,
      },
    });
    console.log(`packages out -------------- ${JSON.stringify(packages)}`);
    
    return packages.map((pkg) => {
      return {
        id: pkg.id,
        authorName: pkg.User.name,
      };
    });
  } catch (error) {
    console.error("Failed to fetch package data:", error);
    return [];
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  siteUrl: process.env.NEXTAUTH_URL,
  generateRobotsTxt: true,
  changefreq: "daily",
  exclude: ['/dashboard/prompts',],
  additionalPaths: async () => {
    const packageData = await fetchPackageData();
    console.log(packageData);
  
    return packageData.map((data) => {
      const loc = `/marketplace/packages/${data.id}`;
      const authorName = data.authorName;
  
      return {
        loc: loc,
        authorName,
      };
    });
  },
};
