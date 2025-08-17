## IT Asset Lifecycle Management System

## Project Overview

This project is a full-stack web application developed as part of the IFN636: Software Life Cycle Management assessment. It extends a starter project with user authentication to implement comprehensive CRUD (Create, Read, Update, Delete) operations for a chosen real-world entity (e.g., a Task Manager, Inventory System, etc.). The application leverages modern web technologies and incorporates industry best practices for project management, version control, testing, and continuous integration/continuous deployment (CI/CD).


The solution comprises a React.js frontend, a Node.js/Express.js backend, and a MongoDB database. The entire development lifecycle is supported by GitHub for version control, Jira for project management, Mocha/Chai/Sinon for testing, and GitHub Actions for automated CI/CD to an AWS EC2 instance managed by Nginx and PM2.

## Features

*   *User Authentication:* Secure user registration, login, and session management using JWT.
*   *CRUD Operations:* Full Create, Read, Update, and Delete functionality for the primary application entity (e.g., tasks, inventory items, etc.).
*   *RESTful API:* A well-structured backend API for seamless communication with the frontend.
*   *Responsive User Interface:* A user-friendly React.js frontend for interacting with the application.
*   *Automated Testing:* Unit and integration tests for backend functionalities using Mocha, Chai, and Sinon.
*   *Continuous Integration:* Automated build and test execution on every push to the main branch via GitHub Actions.
*   *Continuous Deployment:* Automatic deployment of the application to an AWS EC2 instance upon successful CI.
*   *Process Management:* Utilisation of PM2 for managing Node.js application processes in production.
*   *Web Server & Reverse Proxy:* Nginx configured to serve the frontend and proxy requests to the backend.
>>>>>>> d9acf30776f95740099c8cb44f9f8ffd1d3753e9

## Project Structure

The project is organized into two main directories: backend and frontend.

## Technologies Used

  ### Frontend
  *   *React.js:* A JavaScript library for building user interfaces.
  *   *Axios:* A promise-based HTTP client for making API requests.
  *   *React Router DOM:* For declarative routing in React applications.
  *   *Bootstrap:* For responsive UI components.

  ### Backend
  *   *Node.js:* A JavaScript runtime built on Chrome's V8 JavaScript engine.
  *   *Express.js:* A fast, unopinionated, minimalist web framework for Node.js.
  *   *MongoDB:* A NoSQL document database.
  *   *Mongoose:* An ODM (Object Data Modelling) library for MongoDB and Node.js.
  *   *JSON Web Tokens (JWT):* For secure user authentication.
  *   *Bcrypt.js:* For password hashing.

  ### Testing
  *   *Mocha:* A feature-rich JavaScript test framework.
  *   *Chai:* An assertion library for Node.js and the browser.
  *   *Sinon.js:* Standalone test spies, stubs, and mocks for JavaScript.

  ### DevOps & Infrastructure
  *   *GitHub Actions:* For CI/CD automation.
  *   *AWS EC2:* Cloud virtual servers for hosting the application.
  *   *Nginx:* A high-performance web server, reverse proxy, and load balancer.
  *   *PM2:* A production process manager for Node.js applications.
  *   *Yarn:* A fast, reliable, and secure dependency management tool.

  ### Project Management & Design
  *   *Jira:* For agile project management (Epics, User Stories, Subtasks, Sprints).
  *   *SysML:* For system design and requirements modelling (Requirement Diagram, Block Definition Diagram, Parametric Diagram).

## Getting Started (Local Development)

  Follow these instructions to set up and run the project on your local machine for development and testing purposes.

  ### Prerequisites

  Before you begin, ensure you have the following installed:

  *   *Node.js* (v18 or higher, v22 recommended)
  *   *npm* (comes with Node.js) or *Yarn*
  *   *MongoDB:* Either a local instance or access to a MongoDB Atlas cluster.
  *   *Git:* For cloning the repository.

  ### Backend Setup

  1.  *Navigate to the backend directory:*
  *   *Node.js & NVM:* Node.js (v22) is installed via Node Version Manager (NVM).
  *   *PM2:* Manages the Node.js backend process (npm run start) and serves the React frontend build (pm2 serve build/ 3000 --name "Frontend" --spa).
  *   *GitHub Actions Self-Hosted Runner:* The EC2 instance hosts a self-hosted runner that executes the CI/CD workflow jobs.

  ### GitHub Secrets

  Sensitive information required by the CI/CD pipeline and the application is stored securely as GitHub Secrets:

  *   *Environment Secrets (for the MONGO_URI environment):*
      *   MONGO_URI: MongoDB connection string for the application.
      *   JWT_SECRET: Secret key used for signing JWTs.
      *   PORT: The port on which the backend server listens.
  *   *Repository Secret:*
      *   PROD: A multi-line secret containing the entire production .env file content, which is written directly to the .env file on the EC2 instance during deployment.

## Project Management & Design

  ### Jira

  Project management is conducted using Jira, following Agile methodologies. The Jira board tracks the development progress through:

  *   *Epics:* High-level features or goals.
  *   *User Stories:* Detailed descriptions of features from a user's perspective.
  *   *Subtasks:* Breakdowns of user stories into actionable development tasks.
  *   *Sprints:* Time-boxed periods for completing a set of user stories.

  *Jira Board URL:* [Insert your Jira Board URL here]

  ### SysML Diagrams

  System design and requirements are captured using SysML diagrams:

  *   *Requirement Diagram:* Illustrates the functional and non-functional requirements of the system and their relationships.
  *   *Block Definition Diagram (BDD):* Defines the system's components (blocks), their properties, and relationships.
  *   *Parametric Diagram:* Specifies constraints and relationships between properties of blocks, often used for performance or resource analysis.

  These diagrams provide a clear architectural blueprint and ensure all functional features are connected and well-defined.

## GitHub Version Control
  *GitHub URL: https://github.com/SaarahFariheen1995/it-asset-management-mern

  The project adheres to standard Git best practices for version control:

  *   *main branch:* Contains stable, production-ready code. All deployments originate from this branch.
  *   *Feature branches:* New features or bug fixes are developed in separate branches.
  *   *Pull Requests (PRs):* All changes are merged into main via pull requests, which undergo code reviews to maintain code quality and consistency.
  *   *Commit Messages:* Commits follow a clear and descriptive convention.

## Live Application

  The application is deployed and accessible at the following public URL:

  *Public URL:* http://13.54.207.234:3000

  *Test Credentials:*
  *   *Username:* saarah10@gmail.com
  *   *Password:* 1234

---