import React from 'react';
import {Modal, Button} from 'react-bootstrap';

const WatchListTagsModalUI = ({
                                  tagList,Price,Quantity,tickerForTagsModal,
                                  showPortfolioModal, handleHidePortfolioModal,
                                  handleNewPortfolioInputChange,
                                  onUpdatePortfolioClick
                              }) =>
    <Modal bsSize="sm" show={showPortfolioModal} onHide={handleHidePortfolioModal}>
        <Modal.Header closeButton>
            <Modal.Title>Enter Transaction info for {tickerForTagsModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <label>Buy Price</label>
            <input defaultValue={Price} style={{width:"50%"}} type="text" className="form-control" placeholder="Buy Price"
                   onChange={(e)=>handleNewPortfolioInputChange("Price",e)}/>
            <br/>
            <label>Quantity Bought</label>
            <input defaultValue={Quantity} style={{width:"50%"}} required  className="form-control" placeholder="Quantity Bought"
                   onChange={(e)=>handleNewPortfolioInputChange("Quantity",e)}/>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={onUpdatePortfolioClick}>Save</Button>
        </Modal.Footer>
    </Modal>

export default WatchListTagsModalUI;
