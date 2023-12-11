import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";
import { api } from "~/utils/api";

export default NextAuth(authOptions);

// export const runtime = 'edge';
