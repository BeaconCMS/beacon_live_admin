export function getParentNodeId(astElementId: string | null = null) {
  if (astElementId) {
    let parts = astElementId.split(".")
    if (parts.length === 1) return "root"
    return parts.slice(0, -1).join(".")
  }
}
