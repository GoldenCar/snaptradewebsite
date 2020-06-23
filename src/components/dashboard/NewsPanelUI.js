import React, {Component} from 'react';
import NewsItemUI from '../news/NewsItemUI.js'
import NewsItemGroupedUI from '../news/NewsItemGroupedUI.js'
import Constants from "../common/Constants";
import {Popover} from "react-bootstrap";


class Items extends Component {
    state = {
        showDesc: false,
        storyDesc: false
    }

    render() {
        const {value, index} = this.props;
        const {showDesc, storyDesc} = this.state;
        let story_details = storyDesc ? value.story_details : value.story_details.slice(0, 3);
        let sing = Math.sign(value.price_increase_over_last_day) === -1;
        return (
            <div className="panel block" key={index}
                 style={{
                     width: "48%",
                     margin: "20px 0",
                     borderRadius: 10
                 }}>
                <div className="blockHeader" style={{
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    padding: 10,
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <div style={{display: 'flex', alignItems: "center"}}>
                            <div style={{
                                fontSize: 20,
                                marginRight: 5
                            }}>
                                <span style={{fontSize: 22}}><b>{value.ticker}</b> </span>
                                {value.close_formatted}
                            </div>
                            <span
                                style={{color: sing ? "#e44" : "#6c9"}}>
                            {!sing && "+"}{value.price_increase_over_last_day} ({!sing && "+"}{value.price_pct_increase_over_last_day}%)
                                        </span>
                        </div>
                        <div>
                            <div>Mkt Cap: {value.market_cap}; 3d Chg%: {value.price_pct_increase_over_3days}%</div>
                        </div>
                    </div>
                    <a href={'/ticker/' + value.ticker}>
                        <span className="panel" style={{
                            fontSize: 37,
                            cursor: 'pointer',
                            userSelect: "none",
                            margin: 0,
                            padding: "0 10px"
                        }}>+
                        </span>
                    </a>
                </div>
                <div style={{
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: "space-between",
                    height: "calc(100% - 80px)"
                }}>
                    <div><b>Sector</b>: {value.sector}</div>
                    <div style={{minHeight: 30}}>
                        {value.short_desc &&
                        <div>
                            {showDesc ? value.short_desc : value.short_desc.slice(0, 80)}<br/>
                            <u onClick={() => this.setState({showDesc: !showDesc})}>{!showDesc ? "Read More" : "Hide"}</u>
                        </div>}
                    </div>
                    <br/>
                    <div style={{minHeight: 140}}>
                        {story_details.map((v, i) => {
                            return (
                                <div key={i} style={{padding: "3px 0"}}><b>{v.label_name}</b> : {v.label_details}</div>
                            )
                        })}
                        <u onClick={() => this.setState({storyDesc: !storyDesc})}>{!storyDesc ? "Read More" : "Hide"}</u>
                    </div>
                    <img src={Constants.CHART_IMG_URL + value.ticker + '.png'} style={{width: '100%', marginTop: 10}}/>
                </div>
            </div>
        )
    }
}

class NewsPanelUI extends Component {
    render() {
        const {
            context, newsList, selected, onFilter,
            isToday, isGroupedNews, onTodayCheckedChange, onDiscovery, isDiscovery,
            typedTicker, onSearchedTickerChange, onTickerSearch, onMoreLessClick
        } = this.props
        return (
            <div>
                <div className="tag-container">
                    <div className={selected == 'sector_id=4' ? 'tag selected' : 'tag'}><a href='#' data-q='sector_id=4'
                                                                                           onClick={onDiscovery}>Discovery new stocks</a></div>

                    {
                        !context.anonymous && context.watchList && context.watchList.length > 0 &&
                        <div className={selected == 'category=watchlist' ? 'tag selected' : 'tag'}>
                            <a href='#' data-q='category=watchlist' onClick={onFilter}>Watchlist News</a>
                        </div>
                    }
                    <div className={selected == "" ? 'tag selected' : 'tag'}><a href='#' data-q='' onClick={onFilter}>Top
                        News</a></div>
                    {/*<div className={selected=='category=latest'?'tag selected':'tag'}><a href='#' data-q='category=latest' onClick={onFilter}>Latest</a></div>*/}
                    {/*<div className={selected == 'sector_id=1' ? 'tag selected' : 'tag'}><a href='#' data-q='sector_id=1'*/}
                    {/*onClick={onFilter}>Tech</a></div>*/}
                    {/*<div className={selected == 'sector_id=3' ? 'tag selected' : 'tag'}><a href='#' data-q='sector_id=3'*/}
                    {/*onClick={onFilter}>Healthcare</a>*/}
                    {/*</div>*/}
                    <div className={selected == 'category=high_gainers' ? 'tag selected' : 'tag'}><a href='#'
                                                                                                     data-q='category=high_gainers'
                                                                                                     onClick={onFilter}>High Gainers News</a></div>
                </div>
                <div>
                    {isDiscovery ? (
                        <div style={{display: 'flex', flexWrap: "wrap", justifyContent: "space-between"}}>
                            {newsList !== null && newsList.length > 0 && newsList.map((v, i) => {
                                return (
                                    <Items value={v} index={i}/>
                                )
                            })}
                        </div>
                    ) : (
                        <div>
                            <div className="checkbox" style={{display: 'inline-block'}}>
                                <label>
                                    <input type="checkbox"
                                           onChange={onTodayCheckedChange}
                                           checked={isToday}/>
                                    Today&#39;s News Only
                                </label>
                            </div>

                            <div className='pull-right' style={{width: '240px', marginTop: '5px'}}>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Ticker"
                                           value={typedTicker}
                                           onChange={onSearchedTickerChange}/>
                                    <span className="input-group-btn">
                          <button type="submit" className="btn btn-default"
                                  onClick={onTickerSearch}>Search News</button>
                        </span>
                                </div>
                            </div>

                            <div className='clearfix'></div>

                            <div className="dashboardnews1" style={{marginTop: 10}}>
                                {
                                    newsList != null && !isGroupedNews &&
                                    newsList.filter(item => !isToday || isToday && item.is_news_today).map((item, i) =>
                                        <NewsItemUI item={item} key={i} showTicker='true'/>
                                    )
                                }
                                {
                                    newsList != null && isGroupedNews &&
                                    newsList.filter(item => !isToday || isToday && item.is_news_today).map((item, i) =>
                                        <NewsItemGroupedUI item={item} key={i} onMoreLessClick={onMoreLessClick}/>
                                    )
                                }
                                {
                                    newsList != null &&
                                    newsList.filter(item => !isToday || isToday && item.is_news_today).length === 0 &&
                                    <div style={{marginTop: 100}} className='text-center'>
                                        No news today
                                    </div>
                                }
                                {
                                    newsList != null &&
                                    newsList.length == 0 &&
                                    <div style={{marginTop: 100}} className='text-center'>
                                        No recent news
                                    </div>
                                }
                            </div>
                        </div>)}
                </div>
            </div>
        )
    }
}

export default NewsPanelUI;
