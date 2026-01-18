import { handleAuth } from "@auth0/nextjs-auth0"

const authHandler = handleAuth()

export async function GET(
  request: Request,
  context: { params: Promise<{ auth0: string }> }
) {
  const params = await context.params
  return authHandler(request, { ...context, params })
}
