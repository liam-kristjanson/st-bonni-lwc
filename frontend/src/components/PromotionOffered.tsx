import { useState } from "react";

interface PromotionOfferedProps {
  mainHeading: string;
  price: string;
  promotionContent: string;
  promotionSubscription: string;
  secondaryHeading: string;
  discountPercentage:number;
}

const PromotionOffered = (props: PromotionOfferedProps) => {
  const [discount, setDiscount] = useState(false);
  const discountPercentage = props.discountPercentage / 100;
  const originalPrice = parseFloat(props.price.replace("$", ""));
  const discountedPrice = originalPrice * (1 - discountPercentage);

  return (
    <div className="container border rounded shadow-lg p-4 my-4 text-center">
      <div className="badge bg-primary text-uppercase mb-3">Most Popular</div>
      <div>
        <div className="col-md-8  mx-auto">
          <h3 className="text-success fw-bold">{props.mainHeading}</h3>

          <div className="mb-4">
            {discount && (
              <h1 className="display-4 text-decoration-line-through text-muted">
                ${originalPrice.toFixed(2)}
              </h1>
            )}
            <h1
              className={`display-4 text-success ${
                discount ? "discounted" : ""
              }`}
            >
              $
              {discount ? discountedPrice.toFixed(2) : originalPrice.toFixed(2)}
            </h1>
            <button
              className="btn btn-link"
              onClick={() => setDiscount(!discount)}
            >
              {discount ? "Remove Discount" : `Apply ${discountPercentage*100}% Off`}
            </button>
          </div>

          <p className="lead mb-4">{props.promotionContent}</p>
          <hr className="border-primary" />
          <h5 className="text-primary">{props.secondaryHeading}</h5>
          <p className="mb-4">{props.promotionSubscription}</p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <button className="btn btn-primary btn-md">Make Offer</button>
            <button className="btn btn-outline-primary btn-md">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionOffered;
