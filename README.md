# island

Run on ubuntu 14.04

The Island App is a node.js application for finding matches based on a users preference of 4 categories.
The application relies on two servers
   1. a basic nodejs/express server
   2. a nodejs/norch(search engine) server
It also depends on serveral nodemodules:
   1. express(cookie-parse,body-parser)
   2. ejs
   3. norch
As well as the facebook api for logging in the user
   
Starting the application:
  1. navigate to the main directory of the repository
  2. run: node app //which starts the main node server
  3. open a new terminal:
  4. navigater to main directory
  5. run: node_modules/norch/bin/norch //which starts the norch server
  
Error handling:
  1. The routes in app.js check redirect the user based on their login status
  2. The main.js for the client side is modular for reliability and refactoring purposes 
  

  
