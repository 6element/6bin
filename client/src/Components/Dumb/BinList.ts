'use strict';

import * as React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map } from 'immutable';

import Bin from './Bin';
import { BinData } from './Bin';

interface BinListProps{
    bins: Map<number, BinData>;
    selectedBin: number;
    isEditing: boolean;
    isAdding: boolean;
    setBinAvailability: (index: number, isAvailable: boolean) => void;
    selectBin: (index: number) => void;
    deleteBin: (index: number) => void;
    setAddMode: (isAdding: boolean) => void;
}

interface BinListState{}

export default class BinList extends React.Component<BinListProps, BinListState> {
    mixins = [PureRenderMixin]

    render() {
        var props = this.props;

        var binList = props.bins.toJS().map((bin: BinData, index: number) => {
            return React.createElement(Bin, {
                key: index,
                id: index,
                position: bin.position,
                type: bin.type,
                imageURL: bin.imageURL,
                isAvailable: bin.isAvailable,
                isSelected: props.selectedBin === index,
                // isPending: bin.isPending,
                isEditing: props.isEditing,
                setBinAvailability: props.setBinAvailability,
                selectBin: props.selectBin,
                deleteBin: props.deleteBin,
                setAddMode: props.setAddMode
            });
        });

        if (props.isEditing){
            var addBinButton = React.createElement('li', {
                id: 'add-bin',
                key: binList.length,
                onClick: () => {
                    props.setAddMode(!props.isAdding);
                }
            }, 'Ajouter benne');

            binList.push(addBinButton);
        }

        return React.createElement('ul', {className: 'bins'},
            binList
        );
    }
};
