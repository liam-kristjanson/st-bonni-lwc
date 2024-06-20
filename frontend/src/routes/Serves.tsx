//import React from "react";
//import Button from 'react-bootstrap/Button';

import PromotionOffered from "../components/PromotionOffered";


const Serves = () => {
    return(
        <>
          <div className=" container">
            <div className="row">

                <div className="col-xl-4 col-md-6 col-sm-12">
                    <PromotionOffered price="$400" mainHeading={"Basic Offer"} secondaryHeading={"Secondary Heading"} promotionContent={"s simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu"} promotionSubscription={"Brief Description"}/>
                </div>
                
                <div className="col-xl-4 col-md-6 col-sm-12">
                    <PromotionOffered price="$600" mainHeading={"Medium Offer"}secondaryHeading={"Secondary Heading"} promotionContent={"s simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu"} promotionSubscription={"Brief Description"}/>
                </div>

                <div className="col-xl-4 col-md-6 col-sm-12">
                    <PromotionOffered price="$1000" mainHeading={"Advanced Offer"}secondaryHeading={"Secondary Heading"} promotionContent={"s simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsu"} promotionSubscription={"Brief Description"}/>
                </div>
            </div>

        </div>
        </>
    );



};
export default Serves;