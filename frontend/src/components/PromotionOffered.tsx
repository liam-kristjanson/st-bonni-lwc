//import React from "react";
//import Button from 'react-bootstrap/Button';

interface PromotionOfferedProps{
mainHeading: String;
price: String;
promotionContent: String;
promotionSubscription: String;


}


const PromotionOffered = (props:PromotionOfferedProps) => {
    return(
                // <div style={{width:"400px" }}>
                
                        <div className=" container border border-success-subtle border-5 rounded-5 shadow-lg  text-wrap overflow-hidden">
                            <div className="row overflow-hidden ">
                                <div className=" col-6 bg-primary rounded overflow-hidden fw-bolder">
                                Most Popular
                                </div>

                                
                            </div>

                            <div className=" row font-weight-semibold text-success justify-content-center ">
                                <div className="col justify-content-center align-content-center">
                                    <h3 className="font-weight-bolder">{props.mainHeading}</h3>
                                    <h1>{props.price}</h1>
                                    <p>Lorem Ipsum</p> <br></br>
                                    
                                    <p>{props.promotionContent}</p>
                                    <hr className=" border border-3 border-opacity-100 border-primary"/>
                                    <h5>{props.promotionContent}</h5>
                                    <p>{props.promotionContent}</p>
                                    <h5>{props.promotionSubscription}</h5>
                                </div>
                            </div>

                        
                            <div className="d-flex justify-content-between overflow-hidden row text-center">
                                <button className="btn btn-primary align-items-center fw-bold col" type="button">Make Offer</button>
                                <button className="btn btn-warning align-items-center  fw-bold col" type="button">Book Now</button>
                            </div>

                        </div>
                //    </div> 
                
           
                
            
            


    );

    // position-relative align-items-stretch



};
export default PromotionOffered;