export type Input = {
  actor?: string
  authorisedActors: string[]
  failSilently?: string
  failureMessage?: string
}

export type InputValues = {
  actor: string
  authorisedActors: string[]
  failSilently: boolean
  failureMessage: string
}
