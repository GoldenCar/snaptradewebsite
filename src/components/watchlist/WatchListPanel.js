import React, {Component} from 'react';
import WatchListPanelUI from './WatchListPanelUI.js';
import WatchListTagsModalUI from './WatchListTagsModalUI.js';
import WatchListPriceQtyModalUI from './WatchListPriceQtyModalUI.js'
import WatchListPortfolioModalUI from './WatchListPortfolioModalUI.js'

import watchlist_tickers from '../../apiclient/watchlist/watchlist_tickers.js';
import watchlist_tags from '../../apiclient/watchlist/watchlist_tags.js';
import watchlist_tickers_tags from '../../apiclient/watchlist/watchlist_tickers_tags.js'
import watchlist_tickers_portfolio from '../../apiclient/watchlist/watchlist_tickers_portfolio.js'
import signals_tickers from '../../apiclient/signals_tickers.js';
import eng_watchlist_tags from '../../apiclient/engagement/eng_watchlist_tags.js';
import eng_wl_tags_ratings from '../../apiclient/eng_wl_tags_ratings.js';
import eng_wl_tags_comments from '../../apiclient/eng_wl_tags_comments.js';
import watchlist_tags_tickers from '../../apiclient/watchlist/watchlist_tags_tickers.js';
import watchlist_portfolio from "../../apiclient/watchlist/watchlist_portfolio";

class WatchListPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            watchList: [],

            // tags
            tagObjList: [],
            tag_id: '',
            showTagsModal: false,
            showPortfolioModal: null,
            tickerForTagsModal: null,
            newTagInput: null,
            ProfileList: [],
            Price: null,
            Quantity: null,
            filteringTagObj: null,

            showPriceQtyModal: false,

            engagement: {},
            ratingSummary: {},
            commentSummary: {},
            shareSummary: {},

            // discussions
            commentList: null,
            newComment: '',
        };
        this.getWatchListTickersCallback = this.getWatchListTickersCallback.bind(this);
        this.getWatchProfileTickersCallback = this.getWatchProfileTickersCallback.bind(this);
        this.deleteWatchlistTickerCallback = this.deleteWatchlistTickerCallback.bind(this);
        this.handleDeleteWatchlistTickerSubmit = this.handleDeleteWatchlistTickerSubmit.bind(this);
        this.getWatchListTagsCallback = this.getWatchListTagsCallback.bind(this);
        this.handleRowTickerClick = this.handleRowTickerClick.bind(this);
        this.handleRowTickerClickCallback = this.handleRowTickerClickCallback.bind(this);

        this.handleRefreshClick = this.handleRefreshClick.bind(this);

        // reload tickers or tags when child components add or delete tickers or tags
        this.handleWatchlistTickersChange = this.handleWatchlistTickersChange.bind(this)
        this.handleWatchlistTagsChange = this.handleWatchlistTagsChange.bind(this)

        // tag filter
        this.handleFilterByTagClick = this.handleFilterByTagClick.bind(this);
        // this.handleDeleteTagClick = this.handleDeleteTagClick.bind(this);

        // tag modal display actions
        this.handleShowTagsModal = this.handleShowTagsModal.bind(this);
        this.handleShowPortfolioModal = this.handleShowPortfolioModal.bind(this);
        this.handleHideTagsModal = this.handleHideTagsModal.bind(this);
        this.handleHidePortfolioModal = this.handleHidePortfolioModal.bind(this);
        this.getWatchListTagsForTickerCallback = this.getWatchListTagsForTickerCallback.bind(this)
        this.getWatchListPortfolioCallback = this.getWatchListPortfolioCallback.bind(this)

        this.handleShowPriceQtyModal = this.handleShowPriceQtyModal.bind(this)
        this.handleHidePriceQtyModal = this.handleHidePriceQtyModal.bind(this)

        // tag modal input actions
        this.handleNewTagInputChange = this.handleNewTagInputChange.bind(this);
        this.handleNewTagSelectionChange = this.handleNewTagSelectionChange.bind(this);

        // tag modal save actions
        this.handleUpdateTagsClick = this.handleUpdateTagsClick.bind(this);
        this.handleUpdatePortfolioClick = this.handleUpdatePortfolioClick.bind(this);
        this.createNewTagCallback = this.createNewTagCallback.bind(this);
        this.updateTagsForTickerCallback = this.updateTagsForTickerCallback.bind(this)

        // engagement summary
        this.handleEngagementChange = this.handleEngagementChange.bind(this);
        this.getEngagementCallback = this.getEngagementCallback.bind(this);

        // up vote down vote
        // this.getRatingsCallback = this.getRatingsCallback.bind(this);
        this.handleThumbsUp = this.handleThumbsUp.bind(this);
        this.handleThumbsDown = this.handleThumbsDown.bind(this);
        this.handleThumbsUpCallback = this.handleThumbsUpCallback.bind(this);
        this.handleThumbsDownCallback = this.handleThumbsDownCallback.bind(this);

        // discussions
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleCommentPost = this.handleCommentPost.bind(this);
        this.handleCommentPostCallback = this.handleCommentPostCallback.bind(this);

        this.reload = this.reload.bind(this);
    }

    render() {
        // console.log(this.state.filteringTagObj);
        return (
            <div>
                <WatchListPanelUI
                    tagId={this.state.tag_id}
                    context={this.props.context}
                    anonymous={this.props.anonymous}
                    watchList={this.state.watchList}
                    ProfileList={this.state.ProfileList}
                    onWatchlistTickersChange={this.handleWatchlistTickersChange}
                    onWatchlistTagsChange={this.handleWatchlistTagsChange}

                    onRefreshClick={this.handleRefreshClick}

                    filteringTagObj={this.state.filteringTagObj}
                    tagObjList={this.state.tagObjList}
                    onRowTickerClick={this.handleRowTickerClick}
                    onFilterByTagClick={this.handleFilterByTagClick}
                    onDeleteWatchlistTickerSubmit={this.handleDeleteWatchlistTickerSubmit}
                    onShowTagsModal={this.handleShowTagsModal}
                    onShowPortfolioModal={this.handleShowPortfolioModal}
                    onShowPriceQtyModal={this.handleShowPriceQtyModal}

                    // engagement summary
                    ratingSummary={this.state.ratingSummary}
                    shareSummary={this.state.shareSummary}
                    commentSummary={this.state.commentSummary}
                    onEngagementChange={this.handleEngagementChange}

                    // up vote down vote
                    onThumbsUp={this.handleThumbsUp}
                    onThumbsDown={this.handleThumbsDown}

                    // discussions
                    newComment={this.state.newComment}
                    commentList={this.state.commentList}
                    onCommentPost={this.handleCommentPost}
                    // embeddableTagUuid
                    embeddableTagUuid={this.props.embeddableTagUuid}
                />
                <WatchListTagsModalUI
                    tagList={this.state.tagObjList}
                    showTagsModal={this.state.showTagsModal}
                    tickerForTagsModal={this.state.tickerForTagsModal}
                    onHideTagsModal={this.handleHideTagsModal}
                    onShowPriceQtyModal={this.handleShowPriceQtyModal}
                    onNewTagInputChange={this.handleNewTagInputChange}
                    onNewTagSelectionChange={this.handleNewTagSelectionChange}
                    onUpdateTagsClick={this.handleUpdateTagsClick}
                />
                <WatchListPortfolioModalUI
                    tagList={this.state.tagObjList}
                    showPortfolioModal={this.state.showPortfolioModal}
                    tickerForTagsModal={this.state.tickerForTagsModal}
                    Price={this.state.Price}
                    Quantity={this.state.Quantity}
                    handleHidePortfolioModal={this.handleHidePortfolioModal}
                    handleNewPortfolioInputChange={this.handleNewPortfolioInputChange}
                    onUpdatePortfolioClick={this.handleUpdatePortfolioClick}
                />
                <WatchListPriceQtyModalUI
                    tagList={this.state.tagObjList}
                    showPriceQtyModal={this.state.showPriceQtyModal}
                    tickerForTagsModal={this.state.tickerForTagsModal}
                    onHidePriceQtyModal={this.handleHidePriceQtyModal}
                    onNewTagInputChange={this.handleNewTagInputChange}
                    onNewTagSelectionChange={this.handleNewTagSelectionChange}
                    onUpdateTagsClick={this.handleUpdateTagsClick}
                />
            </div>
        );
    }

    componentWillMount() {
        // console.log('here0');
        if (!this.props.embeddableTagUuid) {
            // console.log('here1');
            watchlist_tickers.get(this.getWatchListTickersCallback, null, null)
        }
        watchlist_tags.get(this.getWatchListTagsCallback)
    }

    componentWillReceiveProps(props) {
        // console.log('here3');
        console.log(props);

        if (props.embeddableTagUuid) {
            console.log('here4');
            watchlist_tickers.get(this.getWatchListTickersCallback, props.embeddableTagUuid, null)
        }
    }

    handleRefreshClick() {
        this.setState({watchList: null})
        this.reload();
    }

    handleWatchlistTickersChange() {
        watchlist_tickers.get(this.getWatchListTickersCallback,
            this.state.filteringTagObj == null ? null : this.state.filteringTagObj.tag_uuid, null)
        // this.state.filteringTagObj == null ? null : this.state.filteringTagObj.tag_id)
    }

    handleWatchlistTagsChange(deletedTagId) {
        watchlist_tags.get(this.getWatchListTagsCallback)
        if (this.state.filteringTagObj && this.state.filteringTagObj.tag_id === deletedTagId) {
            this.setState({filteringTagObj: null})
            watchlist_tickers.get(this.getWatchListTickersCallback, null, null)
        }
    }

    handleEngagementChange() {
        eng_watchlist_tags.get(this.getEngagementCallback, this.state.filteringTagObj.tag_id);
    }

    getWatchListTickersCallback(json, tagUuid, tagId) {
        let filteringTagObj = null;
        // console.log(tagUuid);
        if (tagUuid) {
            this.state.tagObjList.forEach((tagObj) => {
                if (tagObj.tag_uuid === tagUuid) {
                    filteringTagObj = tagObj;
                }
            })
        }

        this.setState({
            watchList: json,
            filteringTagObj: filteringTagObj
        });
        if (filteringTagObj !== null && !this.props.embeddableTagUuid) {
            eng_watchlist_tags.get(this.getEngagementCallback, filteringTagObj.tag_id);
        }
    }

    getWatchProfileTickersCallback(json, tagId) {
        this.setState({
            ProfileList: json,
            tag_id: tagId,
        });
    }


    reload() {
        watchlist_tickers.get(this.getWatchListTickersCallback,
            this.state.filteringTagObj == null ? null : this.state.filteringTagObj.tag_uuid, null)
    }

    getEngagementCallback(engagement, tagId) {
        console.log(tagId);
        this.setState({
            ratingSummary: engagement.rating.summary,
            commentSummary: engagement.comments.summary,
            commentList: engagement.comments.detail,
            shareSummary: engagement.share.summary,
        })
    }

    getWatchListTagsCallback(json) {
        this.setState({tagObjList: json})
    }

    handleRowTickerClick(event) {
        // without preventDefault the panel collapses
        event.preventDefault()
        console.log(event.target)
        let ticker = event.target.getAttribute('data-ticker')
        console.log(ticker)

        if (this.removeSignalListIfPresent(ticker)) {
            console.log('removed')
            return;
        }

        signals_tickers.get(this.handleRowTickerClickCallback, ticker)
    }

    handleRowTickerClickCallback(signalList, ticker) {
        let watchList = this.state.watchList;
        watchList.forEach((watch) => {
            if (watch.ticker === ticker) {
                watch.signalList = signalList
            }
        })
        this.setState({watchList: watchList});
    }

    removeSignalListIfPresent(ticker) {
        let watchList = this.state.watchList;
        let removedCurrentTicker = false
        watchList.forEach((watch) => {
            if (watch.signalList) {
                delete watch.signalList
                delete watch.stockData
                delete watch.tickerInfo
                this.setState({watchList: watchList});
                if (watch.ticker === ticker)
                    removedCurrentTicker = true
            }
        })
        return removedCurrentTicker
    }

    handleFilterByTagClick(event) {
        event.preventDefault()
        let tagId = event.target.getAttribute('data-tag_id')
        let tagUuid = event.target.getAttribute('data-tagUuid')
        if (tagUuid === 'all') {
            tagId = null;
            tagUuid = null;
        }
        watchlist_portfolio.get(this.getWatchProfileTickersCallback, "",tagId);
        watchlist_tickers.get(this.getWatchListTickersCallback, tagUuid, null)
    }

    handleDeleteWatchlistTickerSubmit(event) {
        event.preventDefault()
        console.log(event.target)
        let ticker = event.target.getAttribute('data-ticker')
        console.log(ticker)
        if (this.state.filteringTagObj)
            watchlist_tags_tickers.delete(this.deleteWatchlistTickerCallback,
                this.state.filteringTagObj.tag_id, ticker)
        else
            watchlist_tickers.delete(ticker, this.deleteWatchlistTickerCallback)
    }

    deleteWatchlistTickerCallback() {
        watchlist_tickers.get(this.getWatchListTickersCallback,
            this.state.filteringTagObj == null ? null : this.state.filteringTagObj.tag_uuid, null)
        //this.state.filteringTagObj == null ? null : this.state.filteringTagObj.tag_id)
    }

    handleShowTagsModal(event) {
        event.preventDefault()
        let ticker = event.target.getAttribute('data-ticker')
        console.log(ticker)
        console.log(this.state.tagObjList);

        watchlist_tickers_tags.get(ticker,
            this.getWatchListTagsForTickerCallback)
    }

    handleShowPortfolioModal(event) {
        event.preventDefault()
        let ticker = event.target.getAttribute('data-ticker')
        console.log(ticker)
        // console.log(this.state.tagObjList);

        watchlist_tickers_portfolio.get(ticker,
            this.getWatchListPortfolioCallback)
    }

    handleShowPriceQtyModal(event) {
        event.preventDefault()
        let ticker = event.target.getAttribute('data-ticker')
        console.log(ticker)
        this.setState({showPriceQtyModal: true})
    }

    handleHidePriceQtyModal(event) {
        if (event)
            event.preventDefault()
        this.setState({showPriceQtyModal: false})
    }

    getWatchListTagsForTickerCallback(ticker, tagObjsForTicker) {
        let tagsForTicker = [];
        tagObjsForTicker.forEach(function (tagObj) {
            tagsForTicker.push(tagObj.tag)
        })
        let tagObjList = this.state.tagObjList;
        tagObjList.forEach(function (tag) {
            tag.hasTicker = tagsForTicker.includes(tag.tag)
        })
        console.log(tagObjList);

        this.setState({
            showTagsModal: true,
            tagObjList: tagObjList,
            tickerForTagsModal: ticker
        })
    }

    getWatchListPortfolioCallback(ticker, tagObjsForTicker) {
        this.setState({
            showPortfolioModal: true,
            Price: tagObjsForTicker.buy_price,
            Quantity: tagObjsForTicker.buy_quantity,
            tickerForTagsModal: ticker
        })
    }

    handleHideTagsModal(event) {
        if (event)
            event.preventDefault()
        this.setState({showTagsModal: false})
    }

    handleHidePortfolioModal(event) {
        if (event)
            event.preventDefault()
        this.setState({showPortfolioModal: false})
    }

    handleNewTagInputChange(event) {
        let tag = event.target.value
        console.log(tag)
        this.setState({newTagInput: tag})
    }

    handleNewPortfolioInputChange = (name, event) => {
        let tag = event.target.value
        this.setState({[name]: tag})
    }

    handleNewTagSelectionChange(event) {
        let tag = event.target.getAttribute('data-tag')
        let checked = event.target.checked
        console.log(tag)
        // console.log(checked)

        let tagObjList = this.state.tagObjList;
        tagObjList.forEach(function (tagObj) {
            if (tagObj.tag === tag) {
                tagObj.hasTicker = checked;
            }
        })

        this.setState({tagObjList: tagObjList})
    }

    handleUpdateTagsClick(event) {
        event.preventDefault();
        if (this.state.newTagInput) {
            watchlist_tags.post(this.createNewTagCallback, this.state.newTagInput)
        } else {
            this.updateTagsForTicker();
        }
    }

    handleUpdatePortfolioClick(event) {
        event.preventDefault();
        watchlist_tickers_portfolio.post(() => this.setState({showPortfolioModal: false}), {
            ticker: this.state.tickerForTagsModal,
            price: this.state.Price,
            quantity: this.state.Quantity,
        })
    }

    createNewTagCallback(createdTag) {
        let tagObjList = this.state.tagObjList;
        // if user entered existing tag name, original tag is returned
        // in that case don't add the tag in tagObjList again
        let existing = false;
        tagObjList.forEach((tag) => {
            if (tag.tag_id === createdTag.tag_id) {
                existing = true
            }
        })
        if (!existing) {
            createdTag.hasTicker = true;
            tagObjList.push(createdTag)
        }
        this.setState({tagObjList: tagObjList})
        this.updateTagsForTicker();
    }

    updateTagsForTicker() {
        let newTagsSelection = []
        let tagObjList = this.state.tagObjList;
        tagObjList.forEach(function (tagObj) {
            tagObj.hasTicker && newTagsSelection.push(tagObj.tag_id)
        })
        console.log(this.state.tickerForTagsModal);
        watchlist_tickers_tags.put(this.updateTagsForTickerCallback,
            this.state.tickerForTagsModal, newTagsSelection)
    }

    updateTagsForTickerCallback() {
        this.setState({showTagsModal: false, newTagInput: null, tickerForTagsModal: null})
        // watchlist_tags.get(this.getWatchListTagsCallback)
    }

    handleThumbsUp(event) {
        event.preventDefault();
        let tagId = event.target.getAttribute('data-objectId')
        eng_wl_tags_ratings.post(this.handleThumbsUpCallback, tagId, 'up')
    }

    handleThumbsUpCallback(engagement, tagId) {
        this.setState({ratingSummary: engagement.rating.summary})
    }

    handleThumbsDown(event) {
        event.preventDefault();
        let tagId = event.target.getAttribute('data-objectId')
        eng_wl_tags_ratings.post(this.handleThumbsDownCallback, tagId, 'down')
    }

    handleThumbsDownCallback(engagement, tagId) {
        this.setState({ratingSummary: engagement.rating.summary})
    }

    handleCommentChange(e) {
        this.setState({newComment: e.target.value});
    }

    handleCommentPost(event) {
        event.preventDefault()
        let newComment = this.state.newComment.trim();
        if (!newComment)
            return;
        eng_wl_tags_comments.post(
            this.handleCommentPostCallback,
            this.state.filteringTagObj.tag_id,
            newComment)
    }

    handleCommentPostCallback(lastComment, ticker) {
        let commentList = this.state.commentList;
        let commentSummary = this.state.commentSummary;
        commentSummary.cnt += 1;
        if (!commentList) {
            commentList = [{}];
        }
        commentList.push(lastComment);
        this.setState({
            commentList: commentList,
            commentSummary: commentSummary,
            newComment: ''
        })
    }

}

export default WatchListPanel;
