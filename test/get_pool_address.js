/*eslint-disable max-len*/

'use strict'

const assert = require('assert')
const {getPoolAddress, getMultiChainPoolAddress} = require('../')
const {heximalToBuffer} = require('./_lib')
const {
    toEthAddress,
    toFactoryInitCode
} = require('../lib/formatter')

describe('getPoolAddress', () => {
    it('Not supported exchange throws error', () => {
        let invalidFactory = 'foo and bar'
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let dotAddress = heximalToBuffer('0x7083609fce4d1d8dc0c979aab8c869ea2c873402')

        assert.throws(
            () => {
                getPoolAddress(invalidFactory, wbnbAddress, dotAddress)
            },
            {
                name: 'Error',
                message: 'invalid exchange name'
            }
        )
    })

    it('First address is not a buffer throws error', () => {
        let invalidAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81cXXX'
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')

        assert.throws(
            () => {
                getPoolAddress('pancake', invalidAddress, wbnbAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('Second address has non hex symbol throws error', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let invalidAddress = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc0XXX'

        assert.throws(
            () => {
                getPoolAddress('pancake', cakeAddress, invalidAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('First address is too long buffer throws error', () => {
        let invalidAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c00')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')

        assert.throws(
            () => {
                getPoolAddress('pancake', invalidAddress, wbnbAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('Second address is too long throw error', () => {
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let invalidAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c000')

        assert.throws(
            () => {
                getPoolAddress('pancake', wbnbAddress, invalidAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('First address is too short throw error', () => {
        let invalidAddress = heximalToBuffer('0x12')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')

        assert.throws(
            () => {
                getPoolAddress('pancake', invalidAddress, wbnbAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('Second address is too short throw error', () => {
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let invalidAddress = heximalToBuffer('0x34')

        assert.throws(
            () => {
                getPoolAddress('pancake', wbnbAddress, invalidAddress)
            },
            {
                name: 'Error',
                message: 'Invalid buffer ETH addresses'
            }
        )
    })

    it('First address is zero throw error', () => {
        let zeroAddress = heximalToBuffer('0x0000000000000000000000000000000000000000')
        let btcbAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c')

        assert.throws(
            () => {
                getPoolAddress('pancake', zeroAddress, btcbAddress)
            },
            {
                name: 'Error',
                message: 'Not accepted zero addresses'
            }
        )
    })

    it('Second address is zero throw error', () => {
        let btcbAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c')
        let zeroAddress = heximalToBuffer('0x0000000000000000000000000000000000000000')

        assert.throws(
            () => {
                getPoolAddress('pancake', btcbAddress, zeroAddress)
            },
            {
                name: 'Error',
                message: 'Not accepted zero addresses'
            }
        )
    })

    it('Addresses are the same throw error', () => {
        let btcbAddress = heximalToBuffer('0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c')

        assert.throws(
            () => {
                getPoolAddress('pancake', btcbAddress, btcbAddress)
            },
            {
                name: 'Error',
                message: 'Not identical addresses'
            }
        )
    })

    it('Pancake exchange', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6')
        let actualAddress = getPoolAddress('pancake', cakeAddress, wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Pancake V2 exchange', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0x0eD7e52944161450477ee417DE9Cd3a859b14fD0')
        let actualAddress = getPoolAddress('pancake2', cakeAddress, wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Bakery exchange', () => {
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let clownAddress = heximalToBuffer('0xfa949ef822125233f1e1a0691c13977b4354b257')
        let expectAddress = heximalToBuffer('0x9d311dd545Ae8b39e86ed3733eDfe4D5B7f27e0a')
        let actualAddress = getPoolAddress('bakery', wbnbAddress, clownAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Jul exchange', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let ePycAddress = heximalToBuffer('0x322895d51479e5de68cc3492bf0dea07c549a0e2')
        let expectAddress = heximalToBuffer('0xf17AD5dAd9293523d6D99a14Add6Cec43f943603')
        let actualAddress = getPoolAddress('jul', cakeAddress, ePycAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Ape exchange', () => {
        let lnxAddress = heximalToBuffer('0xc465503b2f65cc67a070f9afe3f095f2d1e49331')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0x878f20766BaE2748eFA77824b8c4f51513aEe3eB')
        let actualAddress = getPoolAddress('ape', lnxAddress, wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Burger exchange', () => {
        let imoAddress = heximalToBuffer('0x6bdd25b0b786ff3e992baa1a2cb6cc41f61d6737')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0x24E6212664ff264EaeBb53926811680d1d9e6AC5')
        let actualAddress = getPoolAddress('burger', imoAddress, wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Bi exchange', () => {
        let formAddress = heximalToBuffer('0x25a528af62e56512a19ce8c3cab427807c28cc19')
        let busdAddress = heximalToBuffer('0xe9e7cea3dedca5984780bafc599bd69add087d56')
        let expectAddress = heximalToBuffer('0x43c1e1a0998d9e025d899e71d5199b6f6911add3')
        let actualAddress = getPoolAddress('bi', formAddress, busdAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Mdex exchange', () => {
        let betAddress = heximalToBuffer('0x028a52032a7075a42585c037f069c62b49ebaa3d')
        let busdAddress = heximalToBuffer('0x55d398326f99059ff775485246999027b3197955')
        let expectAddress = heximalToBuffer('0x40050bc7c87a2e1669f8d55f607a145bd54fa4f4')
        let actualAddress = getPoolAddress('mdex', betAddress, busdAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Cafe exchange', () => {
        let usdtAddress = heximalToBuffer('0x23396cf899ca06c4472205fc903bdb4de249d6fc')
        let usdcAddress = heximalToBuffer('0x55d398326f99059ff775485246999027b3197955')
        let expectAddress = heximalToBuffer('0x85d2e6d17162275740e1e630933306ce50967073')
        let actualAddress = getPoolAddress('cafe', usdtAddress, usdcAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Jet exchange', () => {
        let busdAddress = heximalToBuffer('0x55d398326f99059ff775485246999027b3197955')
        let ad2Address = heximalToBuffer('0xc4acd115f1ceebd4a88273423d6cf77c4a1c7559')
        let expectAddress = heximalToBuffer('0xedd292325acd24d045077ffcad2b1020db9bcec1')
        let actualAddress = getPoolAddress('jet', busdAddress, ad2Address)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Baby exchange', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        let expectAddress = heximalToBuffer('0x8eea120384ace96a63e2f144ef7f9a6f2bbcff8f')
        let actualAddress = getPoolAddress('baby', cakeAddress, wbnbAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })

    it('Openocean exchange', () => {
        let metapayAddress = heximalToBuffer('0x4c460c84b34a89fb76778a0995b2128e6038c995')
        let busdAddress = heximalToBuffer('0xe9e7cea3dedca5984780bafc599bd69add087d56')
        let expectAddress = heximalToBuffer('0x564e68785fa27e836160ffce201051dce17c5e18')
        let actualAddress = getPoolAddress('openocean', metapayAddress, busdAddress)

        assert.deepStrictEqual(actualAddress, expectAddress)
    })
    it('get multi chain pool address', () => {
        let cakeAddress = heximalToBuffer('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82')
        let wbnbAddress = heximalToBuffer('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        const PANCAKESWAP_FACTORY_ADDRESS_V1 = toEthAddress(
            '0xbcfccbde45ce874adcb698cc183debcf17952812'
        )
        const PANCAKESWAP_FACTORY_CODE_V1 = toFactoryInitCode(
            '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'
        )
        let poolAddress = getPoolAddress('pancake', cakeAddress, wbnbAddress)
        let multiChainPoolAddress = getMultiChainPoolAddress(
            PANCAKESWAP_FACTORY_ADDRESS_V1,
            PANCAKESWAP_FACTORY_CODE_V1,
            cakeAddress,
            wbnbAddress
            )
        assert.deepStrictEqual(poolAddress, multiChainPoolAddress)
    })
})
