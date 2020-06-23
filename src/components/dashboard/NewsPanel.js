import React, { Component } from 'react';
import NewsPanelUI from './NewsPanelUI.js';

import news from '../../apiclient/news/news.js';
import discovery from '../../apiclient/discovery';

class NewsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsList : null,
      selected : "sector_id=4",
      typedTicker : null,
      isToday : false,
      isGroupedNews : true,
      isDiscovery : true
    };
    this.getNewsCallback = this.getNewsCallback.bind(this);
    this.getGroupedNewsCallback = this.getGroupedNewsCallback.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleTodayCheckedChange = this.handleTodayCheckedChange.bind(this);
    this.handleSearchedTickerChange = this.handleSearchedTickerChange.bind(this);
    this.handleTickerSearch = this.handleTickerSearch.bind(this);
    this.handleMoreLessClick = this.handleMoreLessClick.bind(this)
  }

  render() {
    return (
      <div>
        <NewsPanelUI
          context={this.props.context}
          newsList={this.state.newsList}
          selected={this.state.selected}
          onFilter={this.handleFilter}
          onDiscovery={this.handleDiscovery}
          isToday={this.state.isToday}
          isGroupedNews={this.state.isGroupedNews}
          isDiscovery={this.state.isDiscovery}
          onTodayCheckedChange={this.handleTodayCheckedChange}
          typedTicker={this.state.typedTicker}
          onSearchedTickerChange={this.handleSearchedTickerChange}
          onTickerSearch={this.handleTickerSearch}
          onMoreLessClick={this.handleMoreLessClick}
        />
      </div>
    );
  }

  componentWillMount() {
    discovery.get(this.getDiscoveryCallback)
  }

  handleFilter(event) {
    event.preventDefault();
    let filter = event.target.getAttribute('data-q')
    console.warn(filter)
    if (filter === "")
      news.get(this.getGroupedNewsCallback, { version: 2 })
    else
      news.get(this.getNewsCallback, { filter: filter })
    this.setState({selected: filter, typedTicker : ''});
  }

  handleDiscovery = (event) => {
    event.preventDefault();
    let filter = event.target.getAttribute('data-q');
    discovery.get(this.getDiscoveryCallback)
    this.setState({isDiscovery:true, selected: filter, newsList : ''});
  }

  handleTodayCheckedChange(event) {
    let checked = event.target.checked
    this.setState({isToday : checked})
  }

  handleTickerSearch(event) {
    event.preventDefault();
    let ticker = this.state.typedTicker.trim()
    console.log(ticker)
    news.get(this.getNewsCallback, { ticker: ticker } )
    this.setState({selected: 'search',});
  }

  getNewsCallback(newsList) {
    this.setState({isGroupedNews: false, newsList: newsList,isDiscovery:false});
  }
  getDiscoveryCallback = (discovery) => {
    console.warn(discovery)
    this.setState({isGroupedNews: false, newsList: discovery});
  }

  getGroupedNewsCallback(newsList) {
    newsList.map((item, i) => {
      item.expanded = false
      item.news.map((innerItem, i) => {
        innerItem.hide = i > 1
      })
    })
    console.log(newsList);
    this.setState({isGroupedNews: true, newsList: newsList,isDiscovery:false});
  }

  handleSearchedTickerChange(event) {
    event.preventDefault()
    console.log(event.target.value)
    this.setState({
      typedTicker: event.target.value.toUpperCase(),
      typed: true
    });
  }

  handleMoreLessClick(event) {
    event.preventDefault()
    let ticker = event.target.getAttribute('data-ticker')
    let newsList = this.state.newsList
    newsList.filter(item => item.ticker === ticker).map(item => {
      item.expanded = !item.expanded
      item.news.map((innerItem, i) => {
        if (i > 1)
          innerItem.hide = !innerItem.hide
      })
    })
    this.setState({newsList: newsList})
  }
}

export default NewsPanel;
