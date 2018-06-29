![nodebadge](https://img.shields.io/badge/node-6.10-brightgreen.svg)

# AWS Lambda Function - Report(s) Download
This is an AWS Lambda function that generates a .zip file of 1 or more SeedScripts reports for download

- **TODO**
 - Create new Lambda function with a proper name
 - Configure Lambda function to watch S3 bucket from Jenkins job
 - Set up Jenkins job to upload zipped codebase to S3
 - Add AWS API Gateway endpoint

- [AWS Lambda Function - Report(s) Download](#aws-lambda-function---reports-download)
    - [How It Works](#how-it-works)
    - [Working with AWS Lambda](#working-with-aws-lambda)
        - [Accessing Lambda](#accessing-lambda)
        - [Permissions](#permissions)
        - [Tags](#tags)
    - [Editing](#editing)
        - [Inline Editing](#inline-editing)
        - [Local Machine](#local-machine)
    - [Local Testing](#local-testing)
        - [Prerequisites](#prerequisites)
        - [Running a local test](#running-a-local-test)
    - [Deployment](#deployment)
        - [Manual Upload](#manual-upload)
        - [Jenkins and S3](#jenkins-and-s3)
    - [Function Documentation](#function-documentation)

## How It Works
AWS Lambda lets you run code without provisioning or managing servers. You pay only for the compute time you consume - there is no charge when your code is not running. Write code locally, send it to Lambda, invoke the function from your code, and you are off and running.

This function takes supplied inputs (see [API Doc](#api-doc) below), and fetches the desired SeedScript reports and packages them in a .zip file (temporarily stored in S3) for a single download.

The workflow looks like this...

1. A user initiates a download in the SeedScripts UI via the download button
2. A request is sent to the SeedScripts Process API
3. That API sends a request to this Lambda Function
4. This function writes a temporary .zip file to S3
5. That file is then returned to the user for download

## Working with AWS Lambda

### Accessing Lambda
Log in to the AWS Console and click on "Lambda" under the "Compute" section

### Permissions
If at any time you are denied permission to something, contact your friendly neighborhood Cloud Ops representative via ticket [here](https://github.platforms.engineering/CloudOps/support)

This function required the following permissions
- Create Lambda function
- Execute Lambda function (we have a new AWS role - facet-team-lambda)
- Permission for S3 bucket access

### Tags
Once the function has been created, it requires tags be filled in. Below is a list of the required tags.

- mon:principal-id
- mon:env
- mon:owner
- mon:data-classification
- mon:cost-center
- mon:userIdentity
- mon:regulated
- mon:project

For help in filling those out, you'll have to contact a member of your team.

## Editing
There are 2 options for editing the Lambda function, with the inline editor in AWS or on your local machine. For simple functions that do not require libraries other than aws-sdk, you can use the inline editor. For everything else, edit on your local machine.

### Inline Editing
If you choose inline editing, you just edit the code directly in AWS Lambda.

### Local Machine
This project is done via this method. Store the code in GitHub, pull it down to your local and develop there. By keeping it in GitHub, it allows us to create a Jenkins job to package the project, store it in S3, and have the Lambda function watch S3 for function changes.

This function was developed in NodeJS v6.10. You can read the AWS Lambda documentation for the other language options.

## Local Testing
### Prerequisites
You will need to install AWS SAM local for testing. For more information about AWS SAM (Serverless Application Model) go [here](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/)
SAM local can be install via npm by running the following command in the terminal 
```
npm install -g aws-sam-local
```
More information is available on SAM local [here](https://github.com/awslabs/aws-sam-local)

You will also need to install Docker. When running locally, SAM local creates a Docker container of your Lambda function to execute in.
Docker can be installed via homebrew if you have a Mac by running the following command in the terminal
```
brew cask install docker
```
You can also download the package from http://docker.com. Once installed, open it so it is running in the background.

### Running a local test
Once the prerequisites are taken care of, you can test locally by running the following in the terminal at the root of the project
```
sam local invoke index -e testEvent.json
```
The first time you do this, it will take some time to download the Lambda configuration from AWS.
Once that is finished, the code will execute and return output to the terminal.

## Deployment
### Manual Upload
Deploying to AWS Lambda requires the project be compressed in a .zip file. You can do this manually and manually upload the code via the AWS Lambda console of your function. To do that run the following command in the terminal at the root of the project
```
zip -r index.zip *
``` 
You can then upload the index.zip file to AWS Lambda and execute the code from there.

### Jenkins and S3
To automate the deployment process, you can create a Jenkins job that builds from GitHub, creates a .zip file, and uploads the .zip file to S3. You can then configure your Lambda function to look at the S3 bucket for code changes.

## Function Documentation
