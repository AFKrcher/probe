# Publically Sourced Reseach and Analytics (PSRA) #

This open source project seeks to design a system that allows a community to update PSRA data on Space Assets.


## Getting set up ##

1. Ensure you have NodeJs installed: https://nodejs.org/en/download/
2. Install Meteor here: https://www.meteor.com/developers/install 
3. Clone the repo `git clone https://bitbucket.org/saber-astronautics-usa/psra.git`
4. Inside the src folder run `meteor npm install`
5. Run `meteor` 
6. Go to `http://localhost:3000` and you should see the test app running.

## Access Mongo
1. Meteor must be running
2. In the command prompt run 
`meteor mongo`
`show collections`
`db.satellites.find()`


## Deployment
Deployment is done using Meteor Cloud. All you have to do is call:

`meteor deploy psra.meteorapp.com --free --mongo`

It will deploy it to the free cluster.