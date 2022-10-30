import * as process from 'process'

import * as core from '@actions/core'

import {Input} from '../src/types'

let mockInput: Partial<Input> = {}
const mockSetFailed = jest.fn((message: string | Error) => {
  return jest.requireActual('@actions/core').setFailed(message)
})
const mockSetOutput = jest.fn((name: string, value: string) => {
  return jest.requireActual('@actions/core').setOutput(name, value)
})
jest.mock('@actions/core', () => ({
  ...jest.requireActual('@actions/core'),
  getInput: jest.fn((name: keyof Input, options?: core.InputOptions) => {
    const input = mockInput[name]

    if (!input && options && options.required) {
      throw new Error(`Input missing: ${name}`)
    }

    return input
  }),
  setFailed: (message: string | Error) => mockSetFailed(message),
  setOutput: (name: string, value: string) => mockSetOutput(name, value)
}))

describe('action-entitled-actor', () => {
  beforeEach(() => {
    process.env.GITHUB_WORKSPACE = 'github-workspace'
    process.env.GITHUB_ACTOR = 'someactor'
    mockInput = {}

    jest.clearAllMocks()
    // because we use require() our code
    jest.resetModules()
  })

  it('uses workflow inputs', () => {
    mockInput = {
      authorisedActors: ['someactor']
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledTimes(0)
  })

  it('sets output', () => {
    mockInput = {
      authorisedActors: ['someactor']
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledTimes(0)
    expect(mockSetOutput).toHaveBeenCalledWith('isAuthorisedActor', true)
  })

  it('fails silently if failSilently is true', () => {
    mockInput = {
      authorisedActors: ['octocat'],
      failureMessage: 'only Octocat can do this!',
      failSilently: 'true'
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledTimes(0)
    expect(mockSetOutput).toHaveBeenCalledWith('isAuthorisedActor', false)
  })

  it('reports failures with default error message', () => {
    mockInput = {
      authorisedActors: ['octocat']
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledWith(
      'Actor is not authorised to trigger this Workflow.'
    )
    expect(mockSetOutput).toHaveBeenCalledWith('isAuthorisedActor', false)
  })

  it('reports failures with custom error message', () => {
    mockInput = {
      authorisedActors: ['octocat'],
      failureMessage: 'only Octocat can do this!'
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    require('../src/main.ts')

    expect(mockSetFailed).toHaveBeenCalledWith('only Octocat can do this!')
    expect(mockSetOutput).toHaveBeenCalledWith('isAuthorisedActor', false)
  })
})
