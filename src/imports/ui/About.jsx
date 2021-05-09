import React from 'react';
import Container from "react-bootstrap/container";
import Figure from "react-bootstrap/figure";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

let TeamMembers = [
    {
        Name : "Nathan Parrott",
        Role: "Developer",
        Img: "https://media-exp1.licdn.com/dms/image/C5603AQEdZJZiV9UjCA/profile-displayphoto-shrink_400_400/0/1586990983579?e=1626307200&v=beta&t=W6ntNlIgGiBPveB6ZsuQWOcr9SWJISXUic0gksJ4gI4",
        Link : "https://www.linkedin.com/in/nathan-parrott-5a459b41/"
    },
    {
        Name : "Connor Okeefe",
        Role: "Researcher",
        Img: "https://media-exp1.licdn.com/dms/image/C5603AQF4wD02tpyEog/profile-displayphoto-shrink_400_400/0/1614361309994?e=1626307200&v=beta&t=v8DjgW7sT7mIeQeD0L-j_dR8yTktuh-BTLMYaN5uFOc",
        Link : "https://www.linkedin.com/in/connorbokeefe/"
    },
    {
        Name : "Craig Robinson",
        Role: "Developer",
        Img: "https://media-exp1.licdn.com/dms/image/C5603AQG2JAe1YRhdPw/profile-displayphoto-shrink_400_400/0/1517623619289?e=1626307200&v=beta&t=JyJMwgeS4KBjW83h7wAbh0qqhn7oVqZc4uEGbDJHhPw",
        Link : "https://www.linkedin.com/in/craig-robinson-space/"
    },
    {
        Name : "Pieter Rombauts",
        Role: "Developer",
        Img: "https://media-exp1.licdn.com/dms/image/C4E03AQGjqxq7GbYdkw/profile-displayphoto-shrink_400_400/0/1517628667975?e=1626307200&v=beta&t=n_GSYSl4jouoYCOXC0Sy4RGmqtiq96TGDy3ai5iyvgE",
        Link : "https://www.linkedin.com/in/pieterrombauts/"
    },
    {
        Name : "Joshua Letcher",
        Role: "Researcher",
        Img: "https://media-exp1.licdn.com/dms/image/C5603AQFd9suLPZJnsw/profile-displayphoto-shrink_400_400/0/1549243332523?e=1626307200&v=beta&t=Vy7p5EKs7AkaqVZp8w3oftqM8irtqMNmoI1bRlNDeec",
        Link : "https://www.linkedin.com/in/joshualetcher/"
    },
    {
        Name : "Sai Vallpureddy",
        Role: "Researcher",
        Img: "https://media-exp1.licdn.com/dms/image/C4D03AQGXDpUGFS4_VQ/profile-displayphoto-shrink_400_400/0/1516977086866?e=1626307200&v=beta&t=NjpWmsf_cgbpvTDX5xE-m6NGCiQ04f3uz3HrMo2Jt9U",
        Link : "https://www.linkedin.com/in/arcskyrider/"
    },
    {
        Name : "Samuel Carbone",
        Role: "Researcher",
        Img: "https://media-exp1.licdn.com/dms/image/C5103AQEDPepjejds_A/profile-displayphoto-shrink_400_400/0/1532044191541?e=1626307200&v=beta&t=IpprlJgx9kgIiM3hAWZbpgEA5zX1auj_ftJPRBzqg3w",
        Link : "https://www.linkedin.com/in/samuel-carbone-100a47168/"
    },
    {
        Name : "Preetham Akula",
        Role: "Researcher",
        Img: "https://media-exp1.licdn.com/dms/image/C5603AQGfqcGAn2_OwQ/profile-displayphoto-shrink_400_400/0/1616467692952?e=1626307200&v=beta&t=IF3sTs9q_WVzklwSoVQzMhyBtu2jyDi5ZIoeRKYrHJI",
        Link: "https://www.linkedin.com/in/preetham-akula/"
    }
];

export const About = () => (

    <>
    
    <Container className="pt-4"> 
        <Row>
            <Col>
                <h1>About this website</h1>
                <p>
                    This website was created by an incredible team of space enthusiasts who got together
                    and gave up their weekend to complete this work during a Hackathon which took place over the 8th - 9th May 2021.                </p>
                <p>
                    We had a lot of fun and hope you find this website helpful! Now it is up to all of us to maintain and populate it!
                </p>
            </Col>
        </Row>
        
        <Row> 
            <h2>Meet the Team</h2>
            <Col>
                {
                    TeamMembers.map( (member) => {
                        return (
                            <a href={member.Link} taget="_blank">
                                <Figure className="p-1">
                                    <Figure.Image
                                        width={171}
                                        height={180}
                                        alt="171x180"
                                        src= {member.Img}
                                    />
                                    <Figure.Caption className="text-center rounded">
                                        <div className="font-weight-bold">{member.Name}</div> 
                                        <div>{member.Role}</div>
                                    </Figure.Caption>
                                </Figure>
                            </a>
                        )
                    })
                }
            </Col>
        </Row>
    </Container>
    <br/>
    </>
  );