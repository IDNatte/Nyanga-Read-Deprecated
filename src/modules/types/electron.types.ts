type appUpdateStatusType =
  | "update-available"
  | "update-unavailabl"
  | "error"
  | "downloading"
  | "downloaded"

export type initDatabaseReturnType = {
  created: boolean
}

export type appUpdateType = {
  checking: boolean
  info?: string | null
  status?: appUpdateStatusType
}
