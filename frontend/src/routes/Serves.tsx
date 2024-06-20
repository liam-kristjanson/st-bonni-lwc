//import React from "react";
//import Button from 'react-bootstrap/Button';

import PromotionOffered from "../components/PromotionOffered";


const Serves = () => {
    return(
        <>
          <div className=" container">
            <div className="row">

                <div className="col-xl-4 col-md-6 col-sm-12">
                <PromotionOffered price="$400" mainHeading={"Basic Offer"} promotionContent={"All things offered"} promotionSubscription={"Brief Description"}/>
                </div>
                
         
                
                <div className="col-xl-4 col-md-6 col-sm-12">
                <PromotionOffered price="$400" mainHeading={"Basic Offer"} promotionContent={"All things offered"} promotionSubscription={"Brief Description"}/>
                </div>

                <div className="col-xl-4 col-md-6 col-sm-12">
                <PromotionOffered price="$400" mainHeading={"Basic Offer"} promotionContent={"All things offered"} promotionSubscription={"Brief Description"}/>
                </div>
           
         </div>

        </div>
        
         


        
        </>
       
        

        


       


    );



};
export default Serves;