import { Card, Col, Container, Row, Spinner, Form } from "react-bootstrap";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Table } from "react-bootstrap";
import { Review } from "../types";
import ServerMessageContainer from "../components/ServerMessageContainer";
import { useAuthContext } from "../hooks/useAuthContext";
import Icon from '@mdi/react';
import { mdiSortCalendarAscending } from '@mdi/js';
import { mdiEmailEditOutline } from '@mdi/js';
import { mdiRenameBoxOutline } from '@mdi/js';
import { mdiStar } from '@mdi/js';
import { mdiCommentAccountOutline } from '@mdi/js';
import { mdiSortCalendarDescending } from '@mdi/js';
import AdminNavbar from "../components/AdminNavbar";
import useNavbar from "../components/hooks/useNavbar";
import { Filter } from "lucide-react";

export default function AdminReview() {
const user = useAuthContext().state.user; 
const [reviews, setReviews] = useState<Review[]>([]);
const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [serverMessage, setServerMessage] = useState<string>('');
const [serverMessageType, setServerMessageType] = useState<'success' | 'danger'>('success');
const {showMenu, handleMenuHide, handleMenuShow} = useNavbar();
const [isSubmittedFilter, setIsSubmittedFilter] = useState<string>("all");


const handleIsSubmittedChange = (newSubmittedFilter: string) => {
  console.log(" --- handleIsSubmittedChange ---");
  setIsSubmittedFilter(newSubmittedFilter);

  setFilteredReviews(reviews.filter(review => {

    if (newSubmittedFilter == "submitted") {
      return review.isSubmitted;
    } else if (newSubmittedFilter == "not submitted") {
      return !review.isSubmitted;
    }

    return true;
  }))
};

const reqHeaders = useMemo<HeadersInit>(() : HeadersInit => {
    return {
      "content-type" : "application/json",
      "authorization": user?.token ?? "none"
    }
  }, [user?.token]);

  const fetchReviews = useCallback(() => { 
      console.log("Processing Display Information...");
      setIsLoading(true);

      fetch(import.meta.env.VITE_SERVER + '/admin/reviews', {
          method: "GET",
          headers : reqHeaders
      })
      .then(response => {
        if (response.ok) {
          setServerMessageType('success');
        } else {
          setServerMessageType('danger');
          throw new Error();
        }
          return response.json()
            })
      .then( responseJson=>{
          console.log(responseJson);

          if (responseJson.error) {
            setServerMessageType('danger');
            setServerMessage(responseJson.error);
          }

          setIsLoading(false);
          setReviews(responseJson);
          setFilteredReviews(responseJson);
      })
      .catch(err => {
        console.error(err);
        setServerMessageType('danger');
        setServerMessage('An unexpected error occured');
      })
    }, [reqHeaders])


    useEffect(() => {
      fetchReviews()
    }, [fetchReviews]);
  

  return(
      <>
        <Container>
            <Row>

                <Col>
                <AdminNavbar
                    showMenu={showMenu}
                    menuHideHandler={handleMenuHide}
                    menuShowHandler={handleMenuShow}
                />

                
            <Col md={12} className="pt-5 mb-2">
              <div className="d-flex align-items-center">
              <Filter size={18} className="me-2 text-primary" />
              <span className="fw-bold text-primary">Filter Reviews</span>
              </div>
            </Col>

            <Col md={3}>
              <Form.Select
                  value={isSubmittedFilter === null ? 'all' : isSubmittedFilter.toString()}
                  onChange={(e) => handleIsSubmittedChange(e.target.value)}
                  className="mb-4"
              >
                  <option value="all">All Reviews</option>
                  <option value="submitted">Submitted Reviews</option>
                  <option value="not submitted">Not Submitted</option>
              </Form.Select>
            </Col>
                
            <Card className="shadow mb-5 shadow rounded-4">
              <Card.Header className="fw-bold">
                Available Reviews
              </Card.Header>

              <Card.Body>
                <Table striped bordered hover variant=" success" >
                  <thead>
                <tr>
                <th className="text-white bg-primary ">Service Date <Icon path={mdiSortCalendarAscending} size={1}  /></th>
                <th className="text-white bg-primary">Name <Icon path={mdiRenameBoxOutline} size={1} /></th>
                <th className="text-white bg-primary">Email <Icon path={mdiEmailEditOutline} size={1}  /></th>
                <th className="text-white bg-primary">Rating <Icon path={mdiStar} size={1}  /></th>
                <th className="text-white bg-primary">Comments <Icon path={mdiCommentAccountOutline} size={1} /></th>
                <th className="text-white bg-primary">Submission Date <Icon path={mdiSortCalendarDescending} size={1}/></th>


                  </tr>
                </thead>

                  <tbody>

                    {isLoading ?(
                      <tr>
                        <td className="text-center" colSpan={3}><Spinner/> Reviews made loading...</td>
                      </tr>          
                    ) : (
                      filteredReviews?.map((review) => (
                        <tr>
                          <td >{new Date(review.serviceDate).toLocaleDateString()}</td>
                          <td>{(review.customerName)}</td>
                          <td>{(review.customerEmail)}</td>
                          <td>{(review.rating)}</td>
                          <td>{(review.comments)}</td>
                          <td>{new Date(review.submittedDate).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}

                  </tbody> 
                  {serverMessage && <ServerMessageContainer variant={serverMessageType} message={serverMessage}/>}
                  </Table>
              </Card.Body>
          </Card>
          </Col>
          </Row>
       </Container>
      </>
  )
}