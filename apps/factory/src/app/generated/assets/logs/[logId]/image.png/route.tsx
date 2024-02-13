import { prisma } from "~/server/db";
import { ImageResponse, type NextRequest } from "next/server";
import { env } from "~/env.mjs";
import { resizeBase64Image } from "~/utils/images";

export async function GET(
  req: NextRequest,
  { params }: { params: { logId: string } },
) {
  // Load the log
  const pl = await prisma.promptLog.findFirst({
    where: {
      id: params.logId,
    },
  });

  // If log not found
  if (!pl) {
    return new Response(`Not Found`, {
      status: 404,
    });
  }

  // Generate the image response
  const searchParams = req.nextUrl.searchParams;
  const defaultWidth = "128";
  const w = parseInt(searchParams.get("w") || defaultWidth);
  const h = parseInt(searchParams.get("h") || w.toString());

  const b64resized = await resizeBase64Image(pl?.completion, w, h, 50);

  const options = {
    width: w,
    height: h,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          width={w}
          height={h}
          src={`data:image/png;base64,${b64resized}`}
          style={{ display: "block" }}
        />
      </div>
    ),
    options,
  );
}
