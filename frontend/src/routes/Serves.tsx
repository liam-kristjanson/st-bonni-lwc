import PromotionOffered from "../components/PromotionOffered";

const Serves = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-md-6 col-sm-12">
            <PromotionOffered
              price="$400"
              mainHeading={"Basic Offer"}
              secondaryHeading={"Lawn Mowing"}
              promotionContent={
                "Get your lawn mowed by our professional team. We ensure a neat and well-maintained lawn that enhances the beauty of your property."
              }
              promotionSubscription={"Weekly or bi-weekly service available."}
              discountPercentage={10}
            />
          </div>

          <div className="col-xl-4 col-md-6 col-sm-12">
            <PromotionOffered
              price="$600"
              mainHeading={"Medium Offer"}
              secondaryHeading={"Lawn Fertilization"}
              promotionContent={
                "Get your lawn mowed by our professional team. We ensure a neat and well-maintained lawn that enhances the beauty of your property"
              }
              promotionSubscription={
                "Seasonal fertilization packages available."
              }
              discountPercentage={20}
            />
          </div>

          <div className="col-xl-4 col-md-6 col-sm-12">
            <PromotionOffered
              price="$1000"
              mainHeading={"Advanced Offer"}
              secondaryHeading={"Lawn Aeration"}
              promotionContent={
                "Get your lawn mowed by our professional team. We ensure a neat and well-maintained lawn that enhances the beauty of your property."
              }
              promotionSubscription={
                "Recommended once a year for best results."
              }
              discountPercentage={100}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Serves;
