'use strict';

import * as React from 'react';
import { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { List, Map } from 'immutable';

import BinList from '../Dumb/BinList';
import WastePicker from '../Dumb/WastePicker';
import { BinData, BinPartialData, BinProps } from '../Dumb/Bin';
import { State, Action } from '../../actions';
import { sendData } from '../../actions'; // async Actions
import { addBin, updateBin, deleteBin, setBinAvailability, saveBins } from '../../actions'; // Bin actions
import { setBinEditMode, setWasteSelectMode, setBinAddMode, selectBin } from '../../actions'; // Display actions
import { addPendingAction, deletePendingAction } from '../../actions'; // Pending actions

interface ReduxPropsMixin{
    dispatch: Dispatch
}

interface BinManagerProps extends ReduxPropsMixin{
    bins: List<BinProps>;
    pending: Map<number, Action>;
    display: Map<string, any>;
}

interface BinManagerState{}

var nextPending = 0;

class BinManager extends React.Component<BinManagerProps, BinManagerState> {
    mixins = [PureRenderMixin]

    render() {
        
        const { dispatch, bins, pending, display } = this.props;

        if (pending.size === 0)
            nextPending = 0; // reinitializing the pending actions counter

        var isEditingBins: boolean = display.get('isEditingBins');
        var hasBinSelected: boolean = display.get('hasBinSelected');
        var isAddingBins: boolean = display.get('isAddingBins');
        var selectedId: number = display.get('selectedBin');

        // Create the bin list
        var binList = React.createElement(BinList, {
            bins,
            selectedId,
            isEditing: isEditingBins,
            isAdding: isAddingBins,
            hasBinSelected: hasBinSelected,
            onBinAvailabilityChange: (id: number, isAvailable: boolean) => { 
                if (!isEditingBins){
                    // after actions will be dispatched after async action
                    var action = setBinAvailability(id, isAvailable);
                    dispatch(
                        addPendingAction(nextPending, action)); // this could be used in a middleware
                    var after = [deletePendingAction(nextPending)];

                    nextPending ++;
                    console.log('Pending action Number', pending.size);

                    dispatch(
                        sendData(action, after));
                }        
            },
            onBinSelection: (id: number) => {
                dispatch(
                    selectBin(id));
                dispatch(
                    setWasteSelectMode(true));
                dispatch(
                    setBinAddMode(false));
            },
            onBinDeletion: (id: number) => {
                dispatch(
                    deleteBin(id));
            },
            onAddModeActivation: () => {
                dispatch(
                    selectBin(undefined));
                dispatch(
                    setWasteSelectMode(true));
                dispatch(
                    setBinAddMode(true));
            }
        });

        // Create the button to edit bins
        var editBinsButton = React.createElement('button', {
                id: 'modify-bins',
                className: isEditingBins ? 'editing' : '',
                onClick: () => {
                    if(!isEditingBins)
                        dispatch(
                            setBinEditMode(true));
                    else {
                        // after actions will be dispatched after async action
                        var action = saveBins(bins);

                        dispatch(
                            setBinEditMode(false));
                        dispatch(
                            selectBin(undefined));
                        dispatch(
                            addPendingAction(nextPending, action)); // this could be used in a middleware

                        var after = [deletePendingAction(nextPending)];
                        nextPending ++;

                        dispatch(
                            sendData(action, after));
                    }
                        
                    if (hasBinSelected)
                        dispatch(
                            setWasteSelectMode(false));
                }
            }, 
            isEditingBins ? 'Valider': 'Modifier les conteneurs'
        );

        // // Create the panel with all bin types used to add bins
        // var binSelector = hasBinSelected ?
        //     React.createElement(WastePicker, {
        //         type: bins.get(selectedId) ? bins.get(selectedId).type : undefined,
        //         onWasteSelection: (delta: BinPartialData) => {
        //             // when waste selected, add Bin, select it and disable Add mode
        //             if (isAddingBins){
        //                 var newBin = Object.assign(delta, {
        //                     position: bins.size,
        //                     isAvailable: true
        //                 });

        //                 dispatch(
        //                     addBin(newBin));
        //                 dispatch(
        //                     selectBin(newBin.position));
        //                 dispatch(
        //                     setBinAddMode(false));
        //             }
        //             else
        //                 dispatch(
        //                     updateBin(selectedId, delta));
        //         }
        //     })
        //     : undefined;

        // Create the info text
        var infos: ReactElement<any>;

        if (pending.size > 0){
            var pendingActions = pending.toList().toJS().map((action: Action, key: number) => {
                return React.createElement('div', {key}, action.type);
            });

            infos = React.createElement('div', {id: 'infos'},
                'En cours de transfert:',
                pendingActions
            );
        }
        

        return React.createElement('div', {id: 'bin-manager'}, 
            binList,
            editBinsButton,
            // binSelector,
            infos
        );
    }
};

// Select only the part of the global state that is needed
function select(state: State) {
    return {
        bins: state.bins,
        pending: state.pending, // => maybe should be in another smart component
        display: state.display
    };
}

// Connect the component to Redux => making it Smart
export default connect(select)(BinManager);
