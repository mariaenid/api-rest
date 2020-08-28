# To start

#steps
`nvm use` select version of node
`yarn install` `npm install`

#To moongoose you can use docker
`docker pull mvertes/alpine-mongo`

#To start database

`docker run -d --name mongodb -p 27017:27017 -v /tmp/mongodb:/data mvertes/alpine-mongo`

# To start use
`yarn start`

#To init use postman

#create a user
POST `http://localhost:3000/signup` send like params `email, password, role: [admin or employer]`

#Obtain a toker
`accessToken`

# add the token in the headers to can use the app

#POST http://localhost:3000/vote params: {voteUser, votedUser, area}
#the area can be: ["teamPlayer", "technicalReferent", "keyPlayer", "clientSatisfaction", "motivation", "fun"]

# Swagger:

`http://localhost:4000/api-docs/`

#Start with signup

#Add token

# start to vote