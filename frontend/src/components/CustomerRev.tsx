import Icon from '@mdi/react';
import { mdiAccountCircleOutline, mdiStarSettings} from '@mdi/js';
//import { Card } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';

interface CustomerReviewProps {
  reviewText?: string,
  customerName?: string,
  numStars?: number,
}

export default function CustomerRev(props: CustomerReviewProps){
 
return(
  <>
  <div className="container justify-content-center border rounded-5 shadow-lg p-5 text-center border border-primary my-3 position-relative" style={{"minHeight": "450px"}}>
    <div className='position-absolute top-0 start-50 translate-middle'> <Icon path={mdiAccountCircleOutline} size={5} style={{ color:'darkgrey'}}  /></div>
      <div className='row'>
          <div className=' col-lg-8 mx-auto'>
              <div className=' d-flex justify-content-center text-center fw-bolder fs-3 text-primary'>
                  {props.customerName ?? "Customer Name"}
              </div>
            </div>
          </div>

          <Row >
            <Col >
              <div className=' d-flex- justify-content-evenly '>
              {(props.numStars ?? 5) >= 1 && <Icon path={mdiStarSettings} size={1.5} style={{color:'gold'}} />}
              {(props.numStars ?? 5) >= 2 && <Icon path={mdiStarSettings} size={1.5} style={{ color:'gold'}} />}
              {(props.numStars ?? 5) >= 3 && <Icon path={mdiStarSettings} size={1.5} style={{ color:'gold'}} />}
              {(props.numStars ?? 5) >= 4 && <Icon path={mdiStarSettings} size={1.5} style={{ color:'gold'}} />}
              {(props.numStars ?? 5) >= 5 && <Icon path={mdiStarSettings} size={1.5} style={{ color:'gold'}} />}
              </div>
            </Col>
          </Row>

          <div className="row">
            <div className="col-lg-8 mx-auto">

                  
              <div className=' mt-4 justify-content-center text-center text-primary fw-medium ali' >
                    {props.reviewText ?? "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil cum pariatur saepe voluptas modi, culpa aut cupiditate? Mollitia earum rem magnam. Ad adipisci fugiat repudiandae iusto quo nam. Explicabo, quibusdam!"}
              </div>
              {/* <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button className="btn btn-outline-primary btn-md mt-5 ">Book Now</button>
                </div> */}
          </div>
        </div>
    </div>
  </>
    
);
}
