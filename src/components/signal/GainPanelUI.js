import React from 'react';
import {OverlayTrigger, Panel, Popover, Glyphicon} from 'react-bootstrap';
import SectorSelectBoxUI from './SectorSelectBoxUI.js';
import PriceRangeSelectBoxUI from './PriceRangeSelectBoxUI.js';
import VolumeRangeSelectBoxUI from './VolumeRangeSelectBoxUI.js';
import DaysPassedSelectBoxUI from './DaysPassedSelectBoxUI.js';
import MainTickerTable from '../widgets/table/MainTickerTable.js';

//- Top gainers of stocks that were flagged by technical scan in the last 21 days

const GainPanelUI = ({
                         context, runDate, runTime, gainList,
                         // price filter
                         priceRangeList, selectedPriceRangeId, onPriceRangeChange,
                         // volume filter
                         volumeRangeList, selectedVolumeRangeId, onVolumeRangeChange,
                         // sector filter
                         sectorList, selectedSectorId, onSectorChange,
                         ageRangeList, selectedAgeRangeId, onAgeRangeChange,
                         onRowSignalClick, onRowWatchClick, onScrollToSignUp,
                         sortColumn, sortOrder, onSort
                     }) =>
    <div className="tmargin20">
        <div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
            <h3 style={{margin: 0, display: 'flex', alignItems: "center"}} className="panelTitle">Discover new
                stocks <OverlayTrigger  trigger={['hover', 'focus']} placement="top"
                                       overlay={<Popover id="signal_strength">The following stocks got surfaced by our
                                           daily market scan that hit multiple bullish technical
                                           indicators</Popover>}><Glyphicon style={{marginLeft:10}} glyph="info-sign" className='text-muted'/>
                </OverlayTrigger>
            </h3>
            <ul className="filtersBar">
                <li><SectorSelectBoxUI
                    sectorList={sectorList}
                    selectedSectorId={selectedSectorId}
                    onSectorChange={onSectorChange}/></li>
                <li><VolumeRangeSelectBoxUI
                    volumeRangeList={volumeRangeList}
                    selectedVolumeRangeId={selectedVolumeRangeId}
                    onVolumeRangeChange={onVolumeRangeChange}
                /></li>
                <li><PriceRangeSelectBoxUI
                    priceRangeList={priceRangeList}
                    selectedPriceRangeId={selectedPriceRangeId}
                    onPriceRangeChange={onPriceRangeChange}
                /></li>
            </ul>
        </div>
        <div className="clearfix"></div>
        <MainTickerTable
            context={context}
            tickerList={gainList}
            columnList={new Set(['name', , 'sector', 'volume', 'volume_chg', '3d_change_pct', '14d_change_pct'])}
        />


    </div>

export default GainPanelUI;
