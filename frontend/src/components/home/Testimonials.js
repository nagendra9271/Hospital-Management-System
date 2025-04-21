import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Dr. Rebecca Martin",
      role: "Chief Medical Officer",
      image: "/api/placeholder/100/100",
      text: "This system has revolutionized how we manage patient care. The intuitive interface and comprehensive features have significantly improved our operational efficiency.",
    },
    {
      id: 2,
      name: "James Wilson",
      role: "Hospital Administrator",
      image: "/api/placeholder/100/100",
      text: "The analytics and reporting capabilities have provided insights that helped us improve resource allocation and reduce operational costs by 23% over the past year.",
    },
    {
      id: 3,
      name: "Nurse Sarah Johnson",
      role: "Head Nurse, Emergency Department",
      image: "/api/placeholder/100/100",
      text: "The patient management features allow our staff to focus more on providing quality care rather than paperwork. Medication tracking and test result integration are game-changers.",
    },
  ];

  return (
    <section className="testimonials-section">
      <Container>
        <h2 className="text-center section-title">
          What Healthcare Professionals Say
        </h2>

        <Row className="mt-5">
          {testimonials.map((testimonial) => (
            <Col lg={4} md={6} key={testimonial.id} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="quote-icon">
                    <FaQuoteLeft />
                  </div>
                  <p className="testimonial-text">{testimonial.text}</p>

                  <div className="testimonial-author">
                    <div className="author-image">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="rounded-circle"
                      />
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;
