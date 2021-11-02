import React from "react";

// @material-ui
import { Grid, makeStyles, Typography, Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatars: {
    maxWidth: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 250px)",
    justifyContent: "space-around",
    gridGap: 40,
  },
  titleContainer: {
    marginBottom: 15,
  },
  title: {
    color: theme.palette.tertiary.main,
    filter: `drop-shadow(3px 2px 2px ${theme.palette.tertiary.shadow})`,
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  aboutParagraph: {
    marginBottom: 10,
  },
  meetTheTeam: {
    marginTop: 30,
    marginBottom: 40,
  },
  meetTheTeamParagraph: {
    marginTop: 15,
  },
  image: {
    display: "block",
    objectFit: "cover",
    verticalAlign: "middle",
    width: "230px",
    height: "230px",
    border: "2.5px solid",
    borderColor: theme.palette.primary,
    borderRadius: 5,
    "&:hover": {
      borderColor: theme.palette.info.main,
    },
  },
  caption: {
    textAlign: "justify",
    marginTop: 5,
  },
  name: {
    fontWeight: 600,
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
    Link: "https://github.com/AFKrcher",
  },
];

export const About = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3" className={classes.titleContainer}>
        About <strong className={classes.title}>PROBE</strong>
      </Typography>
      <Typography variant="body1" className={classes.aboutParagraph}>
        <strong>P</strong>ublicly <strong>R</strong>esearched <strong>O</strong>
        bservatory (PROBE) is a web application created by an incredible team of
        space enthusiasts who got together and gave up their weekend to complete
        this work during a Hackathon which took place over the 8th - 9th May
        2021.
      </Typography>
      <Typography variant="body1" className={classes.aboutParagraph}>
        Fueled by Pizza and Lofi, we had a lot of fun and hope you find this
        website helpful and useful! Now it is up to all of us to maintain and
        populate it!
      </Typography>
      <Typography variant="body1">
        After the Hackathon, a pair of developers, Justin and Archer, continued
        the development of the application starting in August 2021. Features
        were added to provide better data entry UX/UI and administrative
        capabilities, enhance application security, and enable integration with
        Saber Astronautics' Space Cockpit for data visualization and analysis.
      </Typography>
      <div className={classes.meetTheTeam}>
        <Typography variant="h4">Meet the Team</Typography>
        <Typography variant="body1" className={classes.meetTheTeamParagraph}>
          Click on our profile pictures to connect with us! If you have
          questions or issues, please click the see the footer at the bottom of
          this page.
        </Typography>
      </div>
      <Container>
        <Grid container spacing={2} className={classes.avatars}>
          {TeamMembers.map((member, index) => {
            return (
              <Grid item xs key={index}>
                <Container>
                  <a
                    href={member.Link}
                    id={`image-${index}`}
                    target="_blank"
                    key={index}
                    className={classes.link}
                    rel="noreferrer"
                  >
                    <img
                      width="100%"
                      height="100%"
                      src={member.Img}
                      className={classes.image}
                      alt={`${member.Name}`}
                    />
                    <Typography variant="body2" className={classes.caption}>
                      <span className={classes.name}>{member.Name}</span>
                      <br />
                      <span>{member.Role}</span>
                    </Typography>
                  </a>
                </Container>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};
