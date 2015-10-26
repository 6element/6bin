'use strict';

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { List } from 'immutable';

import BinList from '../Dumb/BinList';
import { BinProps } from '../Dumb/Bin';
import { addBin, setAvailability } from '../actions';

interface ReduxPropsMixin{
    dispatch: Dispatch
}

interface BinManagerProps extends ReduxPropsMixin{
    bins: List<BinProps>;
}

interface BinManagerState{}

class BinManager extends React.Component<BinManagerProps, BinManagerState> {
    mixins = [PureRenderMixin]

    render() {
        
        const { dispatch, bins } = this.props;

        return React.createElement('div', {id: 'bin-manager'}, 
            React.createElement(BinList, {
                bins,
                onToggleClick: (index: number, available: boolean) => dispatch(setAvailability(index, available))
            })
        );
    }
};

// Select only the part of the global state that is needed
function select(state: any) {
    return {
        bins: state.bins
    };
}

// Connect the component to Redux => making it Smart
export default connect(select)(BinManager);
