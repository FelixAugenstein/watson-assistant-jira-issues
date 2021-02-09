/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */

// JIRA REST API v3 documentation:
// https://developer.atlassian.com/cloud/jira/platform/rest/v3/ 

/* 
Issue ID can be found by opening the issue and checking the URL:
 - Story issuetype is 10001
 - Task issuetype is 10002
 - Bug issuetype is 10003

 Project ID can be found by going to view all projects and inspecting the element, the corresponding project ID is in the image
 - For the first created project the ID is usually 10000
 - For the second created project the ID is usually 10001
 - ...
 */
  
// Load async
const async = require('async');

var https = require('follow-redirects').https;
var fs = require('fs');

const main = async (params) => {

    // define a returnString
    let returnString = '';

    // define the params
    jiraIssueType = params.jiraIssueType;
    jiraIssueSummary = params.jiraIssueSummary;
    jiraIssueDescription = params.jiraIssueDescription;

    const newJiraIssue = async (params) =>  {
             
        var options = {
            'method': 'POST',
            /*--------------------------------------------
            YOUR INPUT REQUIRED HERE: PROVIDE YOUR HOSTNAME
            --------------------------------------------*/
            'hostname': 'YOUR_HOSTNAME.atlassian.net',
            'path': '/rest/api/3/issue/',
            /*--------------------------------------------
            YOUR INPUT REQUIRED HERE: PROVIDE YOUR HEADERS AUTHORIZATION & COOKIE
            --------------------------------------------*/
            'headers': {
                 'Authorization': 'YOUR_AUTHORIZATION_HERE',
                 'Content-Type': 'application/json',
                 'Cookie': 'YOUR_COOKIE_HERE'
            },
            'maxRedirects': 20
        };
        
        var req = https.request(options, function (res) {
            var chunks = [];
            
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
            
            res.on("error", function (error) {
                console.error(error);
            });
        });
        
        var postData = JSON.stringify({
            "fields":{
                "project":{
                    /*--------------------------------------------
                    YOUR INPUT REQUIRED HERE: PROVIDE YOUR PROJECT ID
                    --------------------------------------------*/
                    "id":"YOUR_PROJECT_ID_HERE"
                },
                "issuetype":{
                    "id":jiraIssueType
                },
                "summary":jiraIssueSummary + ' [created by Watson Assistant via REST API]',
                "description":{
                    "type":"doc",
                    "version":1,
                    "content":[{
                        "type":"paragraph",
                        "content":[{
                            "text":jiraIssueDescription,
                            "type":"text"
                        }]
                    }]
                }
            }
        });
        console.log(postData);
        
        req.write(postData);
        
        req.end();
         
    }
    
    newJiraIssue();

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(newJiraIssue), 5000)
    });

    let result = await promise; // wait until the promise resolves (*)
  
    //alert(result); // "done!"
    console.log(result);
        
    // return message with returnString
    returnString = `Ein neues Issue wurde erstellt. Summary: ${jiraIssueSummary}. Description: ${jiraIssueDescription}.`;
    console.log(returnString);
    return { message: returnString };
}