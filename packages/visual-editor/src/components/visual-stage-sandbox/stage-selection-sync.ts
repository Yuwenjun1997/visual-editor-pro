/** Keeps host state echoes from overwriting a newer selection made inside the stage. */
export const createStageSelectionSync = () => {
  let lastAppliedStateRevision = -1
  let syncedSelectedVid: string | undefined
  let pendingLocalSelectedVid: string | undefined

  const shouldApplyState = (incomingRevision: number) => {
    if (incomingRevision < lastAppliedStateRevision) return false
    lastAppliedStateRevision = incomingRevision
    return true
  }

  const shouldApplySelection = (incomingVid: string, currentVid: string) => {
    syncedSelectedVid = undefined
    if (pendingLocalSelectedVid === incomingVid) {
      pendingLocalSelectedVid = undefined
      return false
    }
    if (pendingLocalSelectedVid || incomingVid === currentVid) return false
    syncedSelectedVid = incomingVid
    return true
  }

  const shouldBroadcastSelection = (vid: string) => {
    if (!vid) return false
    if (vid === syncedSelectedVid) {
      syncedSelectedVid = undefined
      return false
    }
    syncedSelectedVid = undefined
    pendingLocalSelectedVid = vid
    return true
  }

  return { shouldApplyState, shouldApplySelection, shouldBroadcastSelection }
}
