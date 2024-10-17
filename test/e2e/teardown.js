import { request } from "@playwright/test"

export default async () => {
  try {
    const context = await request.newContext({
      baseURL: "http://localhost:4020/admin",
    })
    await context.post("/halt")
  } catch (e) {
    // we expect the request to fail because the request
    // actually stops the server
    return
  }
}
