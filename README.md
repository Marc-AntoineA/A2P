
# A2P - Automated Application Process
**Author:** Marc-Antoine Augé

A2P is a a complete online solution to automate the administration of the Application Process of Social Hackers Academy ([see][sha-website]), based on the technologies teached in the School.

The project is splitted into three parts:
  - `applicant-frontend`: a website in [React][react] which provides to the applicants a mobile-first website where it's easy to apply and check their progression ;
  - `superviser-frontend`: a website in [VueJS][vuejs] which provides to the supervisers an easy way to validate the different steps, start new cohorts... ;
  - `backend`: a complete API in [NodeJS][nodejs] and [Express][express] in order to link together the [MongoDB][mongodb] database and the frontends ;

# Release V1!  

  - Allow an applicant to apply and to an opened process
  - Allow an applicant to start completing a step and save it before submit it
  - Allow an applicant to see the status of each of his step:
  -- *todo* if not submitted,
  -- *pending* if submitted and waiting a validation by a superviser,
  -- *validated* if validated by a superviser,
  -- *rejected* if the answer should be edited and submitted again.
    Only steps in status *todo* and *rejected* can be edited.
  - Process deadline displayed
  - Checking the required answers before going next page
  - Allow swiping on mobile to change the current page
  - Allow fully customization of processes with an easy-to-use draft form (a form cannot be edited once it's opened)
  - Allow to see the progress of every applicant and validate & note every step if needed
  - Allow to start a new process from an existing one

## Installation

A2P requires [Node.js][nodejs], [React][react] and [VueJS][vuejs]

```sh
git clone https://github.com/Marc-AntoineA/A2P.git
```

#### Prerequisites
- Create a MongoDB database and an user (see [Atlas][atlas])
- Create a OAuth2 token to the GMail address used (see [How to get a gmail token][nodemailer-setup])
- Edit the `settings.json` files properly.

#### Backend
Install the dependencies and and start the server.

```sh
$ cd backend
$ npm install
$ npm start
```
The website will be accessible in `localhost:3000`.

#### Superviser-Frontend
Install the dependencies and start the server
```sh
$ cd superviser-frontend
$ npm install
$ npm start
```
In production:
```sh
$ npm run build
```
build the complete application in a `/dist` folder, automatically served by the backend in the relative path: `/administration` (static files in path `/administration/static-superviser`).

### Applicant-Frontend

Install the dependencies and start the server
```sh
$ cd applicant-frontend
$ npm install
$ npm start
```

In production:
```sh
$ npm run build
```
build the complete application in a `/build` folder, automatically served by the backend in the relative path: `/` (static-files in path `/static-applicant`).

### TODO
- Allow supervisers and applicants to forgot their password

License
----
MIT



[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [sha-website]: <https://socialhackersacademy.org>
   [express]: <http://expressjs.com>
   [vuejs]: <https://vuejs.org>
   [react]: <http://reactjs.org>
   [react-bootstrap]: <hhttps://react-bootstrap.github.io/>
   [element]: <https://element.eleme.io>
   [nodejs]: <https://nodejs.org>
   [npm]: <https://npmjs.com>
