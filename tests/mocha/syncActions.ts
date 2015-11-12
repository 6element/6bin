/// <reference path="../../typings/tsd.d.ts" />

'use strict';
require('es6-shim');

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Map } from 'immutable';

import * as actions from '../../client/src/actions';
import reducers from '../../client/src/reducers';
import { logger } from '../../client/src/middleware';
import BinManager from '../../client/src/Components/Smart/BinManager';
import { BinData } from '../../client/src/Components/Dumb/Bin';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

var expect = chai.expect;
var assert = chai.assert;

var createStoreWithMiddleware = applyMiddleware(
    logger
)(createStore);
var store = createStoreWithMiddleware(reducers);


describe('Synchronous Actions', () => {

    it('SET_BINS', () => {

        var bins = Map<string, BinData>({
            AMEUBLEMENT_1: { id: 'AMEUBLEMENT_1', position: 1, type: 'Ameublement', isAvailable: true },
            BATTERIES_1: { id: 'BATTERIES_1', position: 2, type: 'Batteries', isAvailable: true },
            BOIS_1: { id: 'BOIS_1', position: 3, type: 'Bois', isAvailable: true },
            ECRANS_1: { id: 'ECRANS_1', position: 4, type: 'Ecrans', isAvailable: true },
            METAUX_1: { id: 'METAUX_1', position: 5, type: 'Metaux', isAvailable: true }
        });

        store.dispatch(actions.setBins(bins));

        return new Promise((resolve, reject) => {
            var binsInStore = store.getState().bins;
            expect(binsInStore.size).to.deep.equal(5);
            resolve();
        });

    });   

    it('ADD_BIN', () => {
        store.dispatch(actions.addBin(2, 'METAUX'));

        return new Promise((resolve, reject) => {
            var binsInStore = store.getState().bins;
            expect(binsInStore.size).to.deep.equal(6);
            resolve();
        });
    });

    it('SET_BIN_AVAILABILITY', () => {

        store.dispatch(actions.setBinAvailability('AMEUBLEMENT_1', false));

        return new Promise((resolve, reject) => {
            var unavailableBin = store.getState().bins.get('AMEUBLEMENT_1');
            expect(unavailableBin.isAvailable).to.be.false;
            resolve();
        });
    });

    // NEED TO REWRITE THIS
    // it('SET_BIN_PENDING', () => {

    //     store.dispatch(actions.setBinPending(4, true));

    //     return new Promise((resolve, reject) => {
    //         var pendingBin = store.getState().bins.get(4);
    //         expect(pendingBin.isPending).to.be.true;
    //         resolve();
    //     });
    // }); 

});
