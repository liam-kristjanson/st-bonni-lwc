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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function AdminReview() {
const user = useAuthContext().state.user; 
const [reviews, setReviews] = useState<Review[]>([]);
const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [serverMessage, setServerMessage] = useState<string>('');
const [serverMessageType, setServerMessageType] = useState<'success' | 'danger'>('success');
const {showMenu, handleMenuHide, handleMenuShow} = useNavbar();
const [isSubmittedFilter, setIsSubmittedFilter] = useState<string>("all");
const [serveDate, setServeDate] = useState<Date>(new Date());
const [subDate, setSubDate] = useState<Date>(new Date());
const [filter, setFilter] = useState<string>("today");


const handleFilterChange = (newFilter: string) => {
  setFilter(newFilter);
};

const handleDateChange = (date: Date | null, isStart: boolean) => {
  if (date) {
    if (isStart) {
      setServeDate(date);
    } else {
      setSubDate(date);
    }
  }
};

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
  }, [user?.token])

  


    const fetchReviews = useCallback(() => { 
        console.log("Processing Display Information...");
        setIsLoading(true);


        

        fetch(import.meta.env.VITE_SERVER + '/admin/reviews', {
            method: "GET",
            headers : reqHeaders
        })
        .then(response => {
            return response.json()
              })
        .then( responseJson=>{
            console.log(responseJson);
            setIsLoading(false);
            setReviews(responseJson);
            setFilteredReviews(responseJson);
        })
    }, [reqHeaders])


    useEffect(() => {
        fetchReviews()
        
    }, [filter, subDate, serveDate, fetchReviews]);
  

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

                
            <Col md={12} className="mb-2">
              <div className="d-flex align-items-center">
              <Filter size={18} className="me-2 text-primary" />
              <span className="fw-bold text-primary">Filter Reviews</span>
              </div>
            </Col>

            <Col md={3}>
              <Form.Select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="today">Today's Reviews</option>
                <option value="service">Service Rendered Date</option>
                <option value="submission">Review submitted Date</option>
                <option value="dateRange">Date Range</option>
            </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Select
                  value={isSubmittedFilter === null ? 'all' : isSubmittedFilter.toString()}
                  onChange={(e) => handleIsSubmittedChange(e.target.value)}
              >
                  <option value="all">All Reviews</option>
                  <option value="submitted">Submitted Reviews</option>
                  <option value="not submitted">Not Submitted</option>
              </Form.Select>
            </Col>

            {filter === "dateRange" && (
            <Col md={6}>
              <div className="d-flex">
                <DatePicker
                  selected={serveDate}
                  onChange={(date: Date | null) => handleDateChange(date, true)}
                  selectsStart
                  startDate={serveDate}
                  endDate={subDate}
                  className="form-control me-2"
                />
                <DatePicker
                  selected={subDate}
                  onChange={(date: Date | null) => handleDateChange(date, false)}
                  selectsEnd
                  startDate={serveDate}
                  endDate={subDate}
                  minDate={serveDate}
                  className="form-control"
                />
              </div>
            </Col>
            )}
                
            <Card className="shadow mb-5 border border-primary border-4 rounded-4">
              <Card.Header className="fw-bold text-center text-bg-primary">
              <h2> AVAILABLE REVIEWS</h2>
              </Card.Header>

              <Card.Body>
                <Table striped bordered hover variant=" success" >
                  <thead>
                <tr>
                <th className="text-bg-primary ">Service Date <Icon path={mdiSortCalendarAscending} size={1}  /></th>
                <th className="text-bg-primary">Name <Icon path={mdiRenameBoxOutline} size={1} /></th>
                <th className="text-bg-primary">Email <Icon path={mdiEmailEditOutline} size={1}  /></th>
                <th className="text-bg-primary">Rating <Icon path={mdiStar} size={1}  /></th>
                <th className="text-bg-primary">Comments <Icon path={mdiCommentAccountOutline} size={1} /></th>
                <th className="text-bg-primary">Submission Date <Icon path={mdiSortCalendarDescending} size={1}/></th>


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
                          <td>{(review.comment)}</td>
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