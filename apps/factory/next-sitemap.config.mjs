// @ts-nocheck
import { PackageVisibility, PrismaClient } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

async function fetchPackageData() {
  try {
    // throw new Error("Simulated error");
    const packageData = await prisma.promptPackage.findMany({
      where: {
        visibility: PackageVisibility.PUBLIC,
      },
      include: {
        User: true,
        templates: {
          include: {
            releaseVersion: true,
            previewVersion: true,
          },
        },
      },
    });
    
    if (!packageData) {
      return [];
    }
    const packages = packageData
    console.log(packages)

    return packages.map((pkg) => {
      return {
        id: pkg.id,
        authorName: pkg.User.username,
        name: pkg.name,
        templateName: pkg.templates,
      };
    });
  } catch (error) {
    console.error("Failed to fetch package data:", error);
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN, // Initialize Sentry with your DSN
      });
      Sentry.captureException(error); // Send the exception to Sentry
    }
    return [];
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  siteUrl: process.env.NEXTAUTH_URL,
  generateRobotsTxt: true,
  changefreq: "daily",
  exclude: ["/dashboard/prompts"],
  additionalPaths: async () => {
    const result = [];
    const packageData = await fetchPackageData();

    packageData.forEach((data) => {
      const loc = `/marketplace/packages/${data.id}`;
      result.push({
        loc: loc,
        authorName: data.authorName,
        lastmod: new Date().toISOString(),
      });

      data.templateName.forEach((test) => {
        if(test.releaseVersion){
          const sugarcubes = `/${data.authorName}/${data.name}/${test.name}/release`;
          result.push({
            loc: sugarcubes,
            authorName: data.authorName,
            lastmod: new Date().toISOString(),
          });
        }
        if(test.previewVersion){
          const sugarcubes = `/${data.authorName}/${data.name}/${test.name}/preview`;
          result.push({
            loc: sugarcubes,
            authorName: data.authorName,
            lastmod: new Date().toISOString(),
          });

        }
      });
    });

    return result;
  },
};

