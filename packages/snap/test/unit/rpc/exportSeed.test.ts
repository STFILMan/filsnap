import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import { exportPrivateKey } from '../../../src/rpc/exportPrivateKey.js'
import { mockSnapProvider } from '../wallet.mock.test.js'
import { testPrivateKeyBase64 } from './keyPairTestConstants.js'

chai.use(sinonChai)

describe('Test rpc handler function: exportSeed', function () {
  const walletStub = mockSnapProvider()

  afterEach(function () {
    walletStub.reset()
  })

  it('should return seed on positive prompt confirmation and keyring saved in state', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()

    const result = await exportPrivateKey(walletStub)

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()

    expect(result).to.be.eq(testPrivateKeyBase64)
  })

  it('should not return seed on negative prompt confirmation', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(false)

    const result = await exportPrivateKey(walletStub)

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(result).to.be.eq(null)
  })
})
