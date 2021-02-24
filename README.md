<h1 align="center" style="border-bottom: none;">:rocket: Watson Assistant & Jira Issues</h1>
<h3 align="center">In this hands-on tutorial you will create a demo for Watson Assistant that is able to create new Issues in your Jira project, using the Jira API and the input you provide to Watson Assistant. The language of this Watson Assistant dialog skill is german.</h3>

## Prerequisites

1. Sign up for an [IBM Cloud account](https://cloud.ibm.com/registration).
2. Fill in the required information and press the „Create Account“ button.
3. After you submit your registration, you will receive an e-mail from the IBM Cloud team with details about your account. In this e-mail, you will need to click the link provided to confirm your registration.
4. Now you should be able to login to your new IBM Cloud account ;-)
5. [Download Postman](https://www.postman.com/downloads/), a programm we will need to work with the Jira API.
6. If you haven't done so already, [sign up for Jira](https://www.atlassian.com/software/jira), you can use the free version.

## Set up your Jira Account

1. You will be required to set up your domain, for instance `my-domain-name.atlassian.net`.
2. Then you can set up projects. Create a project an make sure to find out the project ID. It can be found by going to view all projects and inspecting the element, the corresponding project ID is in the image.
 - For the first created project the ID is usually 10000
 - For the second created project the ID is usually 10001
 - ...

![JIRA Project ID](readme_images/jira-project-id.png)

3. Finally, you need to create a new API token. Therefore, go to Account Settings --> Security --> Create and manage API tokens, then create a new API token. Choose a label, copy the generated token and save it for later.


## Use Postman to test the Jira API with your project

Now it is time to create our first issue via Postman and the [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/). The corresponding documentation to create an issue can be found [here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post).

![Postman Test](readme_images/postman-test.png)

1. Create a new collection and call it for instance Jira.
2. Add a new request.
3. Select POST to make a new Post Request and provide the correct endpoint to create a new issue, with your specific domain: `https://YOUR_NAME_HERE.atlassian.net/rest/api/3/issue/`.
4. Under Authorization select Basic Auth as type and provide your email you used to register as the username and your created API token as password.
5. Then go to Body, select raw and paste in the following code. Make sure to provide your correct project ID. 

```
{
    "fields": {
        "project": {
            "id": "YOUR_PROJECT_ID_HERE"
        },
        "issuetype": {
            "id": "10003"
        },
        "summary": "New Bug created via Postman",
        "description": {
            "type": "doc",
            "version": 1,
            "content": [
                {
                "type": "paragraph",
                "content": [
                    {
                    "text": "Description of the Bug created via Postman",
                    "type": "text"
                    }
                ]
                }
            ]
        }
    }
  }
```

6. Click Send.

If you get a 201 Created response you should be able to see the new issue in your backlog inside your Jira project.

If you get a 400 Bad request response change the issuetype below the project id to 10001 or 10002.

One more step: After the successful Post Request, click the code button in Postman, select native Node.Js and copy the code.

![Native NodeJS Code](readme_images/native-nodeJS-code.png)

## Set up the Cloud Function

In your IBM Cloud account go to IBM Cloud Dashboard. Click the Cloud Functions button, then go to Actions and click create, to create a new action.

![Cloud Functions Button](readme_images/cloud-functions-button.png)

Give your action a name, keep the Default Package and choose Node.js - for instance 10 or 12 - as your runtime. Click create.

![Create Cloud Function Action](readme_images/create-cloud-function.png)

Copy and paste the `create-jira-issue.js` code. Now you need to provide some properties from the native Node.Js code you copied from Postman:

- Correct hostname
- Header Authorization
- Header Cookie
- Project ID

Check all the lines in the code where it says 'YOUR INPUT REQUIRED HERE' and provide those 4 properties.

![Provide your data](readme_images/provide-your-data.png)

Now you can test your Cloud Function to make sure everything works fine. Therefore, save it and click Invoke with Parameters, provide the input below, and click Apply, then click Invoke. Results are shown in the Activations pane. In Jira your new issue should be created.

```
{
  "jiraIssueType": "10002",
  "jiraIssueSummary": "New Task created via IBM Cloud Function", 
  "jiraIssueDescription": "Description of the Task created via IBM Cloud Function"
}
```

Now go to Endpoints, enable it as a Web Action, save and copy the provided URL. You will need it later on, when setting up your Watson Assistant.

![Create Endpoint Web Action](readme_images/create-endpoint-web-action.png)

## Set up Watson Assistant on the IBM Cloud

In your IBM Cloud Account go to the dashboard by clicking the IBM Logo in the upper left. Go to Catalog and select the AI / Machine Learning category under services or search for Watson Assistant. Then create a new Watson Assistant service, the Lite Plan should work for this tutorial. 

![Create Watson Assistant](readme_images/create-watson-assistant.png)

Afterwards launch your Watson Assistant Service, you will find it on your dashboard under services.

Go to skills and create a new skill, when asked choose the dialog skill. Select import skill and upload the `skill-create-Jira-Issues.json` file.

![Import Skill](readme_images/import-skill.png)

Click options and then select Webhooks. Provide the Web Action URL you obtained when creating the Endpoint. Make sure to add a `.json` at the end.

![Add Webhook with JSON](readme_images/add-webhook-dotjson.png)

Now you can go to the dialog and try it out for yourself. You can create a new issue and verify it in your Jira project.

![Try it Out](readme_images/try-it-out.png)


## If you have any questions just contact me
Felix Augenstein<br>
Digital Tech Ecosystem & Developer Representative @IBM<br>
Twitter: [@F_Augenstein](https://twitter.com/F_Augenstein)<br>
LinkedIn: [linkedin.com/in/felixaugenstein](https://www.linkedin.com/in/felixaugenstein/)
