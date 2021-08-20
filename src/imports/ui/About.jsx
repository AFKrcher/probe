import React from "react";

// @material-ui
import Container from "react-bootstrap/container";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import Figure from "react-bootstrap/figure";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 280px)",
    justifyContent: "space-around",
    gridGap: 30,
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  image: {
    border: "1px solid",
    borderRadius: 5,
    "&:hover": {
      border: "2px solid",
      borderColor: theme.palette.info.light,
    },
  },
  caption: {
    textAlign: "center",
  },
  name: {
    fontWeight: 600,
    marginTop: 0,
    marginBottom: -15,
  },
}));

let TeamMembers = [
  {
    Name: "Nathan Parrott",
    Role: "Developer",
    // Img: "https://media-exp1.licdn.com/dms/image/C5603AQEdZJZiV9UjCA/profile-displayphoto-shrink_800_800/0/1586990983579?e=1634774400&v=beta&t=ddo4ihOnFfy-RVVz8Foae81mxNTMkAYgl0RBDUzTzLY",
    Img: "/team/nathan-parrot.png",
    Link: "https://www.linkedin.com/in/nathan-parrott-5a459b41/",
  },
  {
    Name: "Connor Okeefe",
    Role: "Researcher",
    // Img: "https://media-exp1.licdn.com/dms/image/C5603AQH6vaqnuRQESw/profile-displayphoto-shrink_800_800/0/1624425336729?e=1634774400&v=beta&t=kURXOIlbIOWRf7pgCxyNMXRIjkxlcVjqX-42f0dhXRM",
    Img: "/team/connor-okeefe.png",
    Link: "https://www.linkedin.com/in/connorbokeefe/",
  },
  {
    Name: "Craig Robinson",
    Role: "Developer",
    // Img: "https://media-exp1.licdn.com/dms/image/C5603AQG2JAe1YRhdPw/profile-displayphoto-shrink_800_800/0/1517623619289?e=1634774400&v=beta&t=Sjt4oqVuAk_tosei_Xbsz4NhM2mkiNvFjwETU9Pk0aw",
    Img: "/team/craig-robinson.png",
    Link: "https://www.linkedin.com/in/craig-robinson-space/",
  },
  {
    Name: "Pieter Rombauts",
    Role: "Developer",
    // Img: "https://media-exp1.licdn.com/dms/image/C4E03AQGjqxq7GbYdkw/profile-displayphoto-shrink_800_800/0/1517628667975?e=1634774400&v=beta&t=lzN4rNJrqOGZr15OhF7LGs-nexoMWIW8ixAKJpiuK8w",
    Img: "/team/pieter-rombauts.png",
    Link: "https://www.linkedin.com/in/pieterrombauts/",
  },
  {
    Name: "Joshua Letcher",
    Role: "Researcher",
    // Img: "https://media-exp1.licdn.com/dms/image/C5603AQFd9suLPZJnsw/profile-displayphoto-shrink_800_800/0/1549243332523?e=1634774400&v=beta&t=A5--ygDQqGDMncSwO3CM61fLWLf8rnPx_9tNf4E5SRA",
    Img: "/team/joshua-letcher.png",
    Link: "https://www.linkedin.com/in/joshualetcher/",
  },
  {
    Name: "Sai Vallpureddy",
    Role: "Researcher",
    // Img: "https://media-exp1.licdn.com/dms/image/C4D03AQGXDpUGFS4_VQ/profile-displayphoto-shrink_800_800/0/1516977086866?e=1634774400&v=beta&t=iIOR7hjHv7d36CWXvTJGmXCHx5BQA2bAtSv3UB-q98I",
    Img: "/team/sai-vallpureddy.png",
    Link: "https://www.linkedin.com/in/arcskyrider/",
  },
  {
    Name: "Samuel Carbone",
    Role: "Researcher",
    // Img: "https://media-exp1.licdn.com/dms/image/C5103AQEDPepjejds_A/profile-displayphoto-shrink_800_800/0/1532044191541?e=1634774400&v=beta&t=3bpa0K1sykaEJpd3l7J2hNwf03dSCrle39jNyBWt5i0",
    Img: "/team/samuel-carbone.png",
    Link: "https://www.linkedin.com/in/samuel-carbone-100a47168/",
  },
  {
    Name: "Preetham Akula",
    Role: "Researcher",
    // Img: "https://media-exp1.licdn.com/dms/image/C5603AQGfqcGAn2_OwQ/profile-displayphoto-shrink_800_800/0/1616467692952?e=1634774400&v=beta&t=Ax7m2n_tSUx9tuNfWOkOmsO2IBqYK0lrOrG5CcSkKX8",
    Img: "/team/preetham-akula.png",
    Link: "https://www.linkedin.com/in/preetham-akula/",
  },
  {
    Name: "Justin Law",
    Role: "Developer",
    // Img: "https://avatars.githubusercontent.com/u/81255462?v=4",
    Img: "/team/justin-law.png",
    Link: "https://www.linkedin.com/in/justinwingchunglaw/",
  },
  {
    Name: "Zach Archer",
    Role: "Developer",
    // Img: "https://static.wikia.nocookie.net/archer/images/7/7b/BeardedArcher.png",
    Img: "/team/zach-archer.png",
    Link: "",
  },
];

export const About = () => {
  const classes = useStyles();
  return (
    <>
      <Container className="pt-4" style={{ margin: "40px 4vw 40px 4vw" }}>
        <Row>
          <Col>
            <Typography variant="h3">
              About <strong>OpenOrbit</strong>
            </Typography>
            <p>
              This web application was created by an incredible team of space
              enthusiasts who got together and gave up their weekend to complete
              this work during a Hackathon which took place over the 8th - 9th
              May 2021.
            </p>
            <p>
              Fueled by Pizza and Lofi, we had a lot of fun and hope you find
              this website helpful and useful! Now it is up to all of us to
              maintain and populate it!
            </p>
            <p>
              After the Hackathon, a pair of developers, Justin and Archer,
              continued the development of the application from August into
              November of 2021. Features were added to provide better data entry
              UX/UI and integration into Saber Astronautics' Space Cockpit for
              data visualization and analysis.
            </p>
          </Col>
        </Row>

        <Typography variant="h4" style={{ marginTop: 30 }}>
          Meet the Team
        </Typography>
        <p>Click on our profile pictures or names to connect with us!</p>
        <Container>
          <Grid container spacing={0} className={classes.container}>
            {TeamMembers.map((member, index) => {
              return (
                <Grid item key={index}>
                  <Figure className="p-1">
                    <a
                      href={member.Link}
                      target="_blank"
                      key={index}
                      className={classes.link}
                    >
                      <Figure.Image
                        width={200}
                        height={200}
                        src={member.Img}
                        className={classes.image}
                        alt={""}
                      />
                      <Figure.Caption className={classes.caption}>
                        <p className={classes.name}>{member.Name}</p>
                        <p>{member.Role}</p>
                      </Figure.Caption>
                    </a>
                  </Figure>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Container>
      <br />
    </>
  );
};
