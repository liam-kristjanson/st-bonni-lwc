import Icon from '@mdi/react';
import { mdiAccountCircleOutline} from '@mdi/js';
//import { Card } from 'react-bootstrap';
import { mdiStarSettingsOutline } from '@mdi/js';
import { Col, Row } from 'react-bootstrap';



export default function CustomerRev(){
 
return(
  <>
  <div className="container justify-content-center border rounded-5 shadow-lg p-5 text-center border border-primary my-3 position-relative">
    <div className='position-absolute top-0 start-50 translate-middle'> <Icon path={mdiAccountCircleOutline} size={5} style={{ color:'darkgrey'}}  /></div>
      <div className='row'>
          <div className=' col-lg-8 mx-auto'>
              <div className=' d-flex justify-content-center text-center fw-bolder fs-3 text-primary'>
                  Customer Name
              </div>
            </div>
          </div>

          <Row >
            <Col >
              <div className=' d-flex- justify-content-evenly '>
              <Icon path={mdiStarSettingsOutline} size={1.5} style={{color:'gold'}} />
              <Icon path={mdiStarSettingsOutline} size={1.5} style={{ color:'gold'}} />
              <Icon path={mdiStarSettingsOutline} size={1.5} style={{ color:'gold'}} />
              <Icon path={mdiStarSettingsOutline} size={1.5} style={{ color:'gold'}} />
              <Icon path={mdiStarSettingsOutline} size={1.5} style={{ color:'gold'}} />
              </div>
            </Col>
          </Row>

          <div className="row">
            <div className="col-lg-8 mx-auto">

                  
              <div className=' mt-4 justify-content-center text-center text-primary fw-medium ali' >
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil cum pariatur saepe voluptas modi, culpa aut cupiditate? Mollitia earum rem magnam. Ad adipisci fugiat repudiandae iusto quo nam. Explicabo, quibusdam!
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
