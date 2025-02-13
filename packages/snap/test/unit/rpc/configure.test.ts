import { expect } from '../../utils'
import { configure } from '../../../src/rpc/configure'
import { mockSnapProvider } from '../wallet-mock'
import * as Constants from '../../../src/constants'

describe('Test rpc handler function: configure', function () {
  const walletStub = mockSnapProvider()

  afterEach(function () {
    walletStub.reset()
  })

  it('should set predefined filecoin configuration based on network', async function () {
    this.retries(3)
    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves(Constants.initialState)

    walletStub.rpcStubs.snap_manageState
      .withArgs({
        newState: {
          filecoin: { config: Constants.testnetConfig, messages: [] },
        },
        operation: 'update',
      })
      .resolves()

    const result = await configure(walletStub, {
      network: 'testnet',
    })

    expect(result.result).to.be.deep.eq(Constants.testnetConfig)
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledWithExactly(
      {
        newState: {
          filecoin: { config: Constants.testnetConfig, messages: [] },
        },
        operation: 'update',
      }
    )
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledTwice()
  })

  it('should set predefined filecoin configuration with additional property override', async function () {
    this.retries(3)
    const customConfiguration = Constants.testnetConfig
    customConfiguration.unit = {
      ...customConfiguration.unit,
      symbol: 'xFIL',
      decimals: 6,
    }

    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves(Constants.initialState)

    walletStub.rpcStubs.snap_manageState
      .withArgs({
        newState: {
          filecoin: { config: customConfiguration, messages: [] },
        },
        operation: 'update',
      })
      .resolves()

    const result = await configure(walletStub, {
      network: 'testnet',
      unit: { symbol: 'xFIL', decimals: 6 },
    })

    expect(result.result).to.be.deep.eq(customConfiguration)
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledWithExactly(
      {
        newState: {
          filecoin: { config: customConfiguration, messages: [] },
        },
        operation: 'update',
      }
    )
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledTwice()
  })

  it('should throw error if wrong derivation path on mainet', async function () {
    this.retries(3)
    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves(Constants.initialState)

    const { error } = await configure(walletStub, {
      network: 'mainnet',
      derivationPath: "m/44'/1'/0'/0/0",
    })

    expect(error?.message).to.be.eq(
      'For mainnet, CoinType must be 461 but got 1'
    )
  })

  it('should throw error if wrong derivation path on testnet', async function () {
    this.retries(3)
    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves(Constants.initialState)

    const { error } = await configure(walletStub, {
      network: 'testnet',
      derivationPath: "m/44'/461'/0'/0/0",
    })

    expect(error?.message).to.be.eq(
      'For testnet, CoinType must be 1 but got 461'
    )
  })
})
