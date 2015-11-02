'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { List, Map } from 'immutable';

import BinList from '../Dumb/BinList';
import { BinProps } from '../Dumb/Bin';
import { State, addBin, setBinAvailability, setBinEditMode, sendData } from '../../actions';

interface ReduxPropsMixin{
    dispatch: Dispatch
}

interface BinManagerProps extends ReduxPropsMixin{
    bins: List<BinProps>;
    modes: Map<string, boolean>;
}

interface BinManagerState{}

class BinManager extends React.Component<BinManagerProps, BinManagerState> {
    mixins = [PureRenderMixin]

    render() {
        
        const { dispatch, bins, modes } = this.props;

        console.log('modes', modes);
        var isEditingBins: boolean = modes.get('isEditingBins');

        var binList = React.createElement(BinList, {
            bins,
            isEditing: isEditingBins,
            onClickSetPending: isEditingBins ?
                (index: number, isAvailable: boolean) => { 
                    dispatch(
                        sendData(setBinAvailability(index, isAvailable)))
                }
                : undefined
        });

        var editBinsButton = React.createElement('button', {
            id: 'modify-bins',
            className: isEditingBins ? 'editing' : '',
            onClick: (index: number, isAvailable: boolean) => {
                dispatch(
                    setBinEditMode(!isEditingBins))
            }
        }, 'Modifier les conteneurs');

        return React.createElement('div', {id: 'bin-manager'}, 
            binList,
            editBinsButton
        );
    }
};

// Select only the part of the global state that is needed
function select(state: State) {
    return {
        bins: state.bins,
        modes: state.modes
    };
}

// Connect the component to Redux => making it Smart
export default connect(select)(BinManager);
