/// <reference path="../../../typings/tsd.d.ts" />

'use strict';
require('es6-shim');

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Map } from 'immutable';

import { addBin, setBins } from '../../client/actions';
import reducers from '../../client/reducers';
import { logger } from '../../client/middleware';
import BinManager from '../../client/Components/Smart/BinManager';
import { BinData } from '../../client/Components/Dumb/Bin';

import * as chai from 'chai';
import chaiAsPromised = require('chai-as-promised');
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

        store.dispatch(setBins(bins));

        return new Promise((resolve, reject) => {
            var binsInStore = store.getState().bins;
            expect(binsInStore.size).to.deep.equal(5);
            resolve();
        });

    });   

    it('ADD_BIN', () => {
        var newBin = { id: 'METAUX_2', position: 6, type: 'Metaux', isAvailable: true };

        store.dispatch(addBin(newBin));

        return new Promise((resolve, reject) => {
            var binsInStore = store.getState().bins;
            expect(binsInStore.size).to.deep.equal(6);
            resolve();
        });
    });


});
