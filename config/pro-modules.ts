// Pro modules shown as locked in the dev panel. This is a showcase only: the
// code of a Pro module never lives in this repository, since anything here
// can be switched on by editing a flag. Once installed, a Pro module is
// declared in config/features.ts like any other module.

export type ProModule = {
  key: string
  label: string
  description: string
  url: string
}

export const proModules: ProModule[] = []
