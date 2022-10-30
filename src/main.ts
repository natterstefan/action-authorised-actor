import * as core from '@actions/core'

import {InputValues} from './types'

const getInput = (): InputValues => ({
  actor: core.getInput('actor') || (process.env.GITHUB_ACTOR as string),
  authorisedActors: core.getInput('authorisedActors', {required: true}),
  failSilently: core.getInput('failSilently') === 'true' || false,
  failureMessage:
    core.getInput('failureMessage') ||
    'Actor is not authorised to trigger this Workflow.'
})

async function run(): Promise<void> {
  // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
  core.debug(`Starting ...`)

  try {
    core.debug(`Reading input ...`)

    const {actor, authorisedActors, failSilently, failureMessage} = getInput()

    core.debug(`Got actor: ${actor}`)
    core.debug(`Got a list of authorised actors ${authorisedActors}`)

    const isAuthorisedActor = authorisedActors.includes(actor)
    core.setOutput('isAuthorisedActor', isAuthorisedActor)

    core.debug(`isAuthorisedActor: ${isAuthorisedActor ? 'Yes' : 'No'}.`)
    core.debug(`Fail silently? ${failSilently ? 'Yes' : 'No'}!`)

    if (!isAuthorisedActor && !failSilently) {
      core.setFailed(failureMessage)
    }

    if (isAuthorisedActor) {
      core.info(`Actor ${actor} is authorised and can proceed!`)
    }
    core.debug(`Validated actor ...`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }

  core.debug(`Ended ...`)
}

run()
