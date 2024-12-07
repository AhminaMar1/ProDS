# ProDS

ProDS stands for: Proxy deployment swaper system, is a flexible proxy deployment swaper (Exchange) system that allows you to seamlessly swap deployed files with your locally built files in any environment.
Whether you're working in development, staging, or production, ProDS enables you to simulate real deployment scenarios by using your local builds without affecting the deployed environment.

## Features
- **Proxy feature**: Easily deboug and develop new features and test then directy without setting the backend
- **Logs of statuses**: Log of behaviors - read - founded - not founded.
- **High Availability**: No downtime during swaps.

## example

## Usage

### Use a broswer extension for redirections
Use a browser extension to redirect all url (or the pre-path url that you wanna to exchange) to the ProDS proxy host.
Example: you can use Requestly extension
[request link](https://)

### Configure the ROOT_PATH
inside config.js, replace ROOT_PATH with the path of th resources dir.
Per default we put: "./resources" path.

### Enable the files that you wanna use ProDS watch for
- For example, if you have an file link like: www.example.com/ui/project13/assets/react-tokentoken.js
and you wanna (replace) watch for just  the files that inside assests you have to configure just that path in FLOWS_TO_READ and will be like:
`FLOWS_TO_READ = ['www.example.com/ui/project13/assets'];`

- if you want to watch for all project inside /ui, you can put 
`FLOWS_TO_READ = ['www.example.com/ui'];`
=> Then ProDS will read all dirs/files inside /ui

- if you wanna watch for the project13 and project01, configure FLOWS_TO_READ as following
`FLOWS_TO_READ = ['www.example.com/ui/project13', 'www.example.com/ui/project01'];`


## Usage Guide

### 1. Redirect URLs Using a Browser Extension
Use a browser extension to redirect all URLs (or the specific base URL you want to replace) to the ProDS proxy host.  
For example, you can use the **Requestly** extension.  
[Download Requestly](https://)

---

### 2. Configure the `ROOT_PATH`
Inside the `config.js` file, replace the `ROOT_PATH` variable with the path to the `resources` directory.  

**Default setting:**  
`ROOT_PATH = "./resources";`

---

### 3. Enable Files for ProDS to Monitor
To configure the files or directories ProDS should monitor, update the `FLOWS_TO_READ` variable.  

#### Examples:

1. **Monitor specific assets in a directory:**  
   If you have a file URL like:  
   `www.example.com/ui/project13/assets/react-tokentoken.js`  
   and you want ProDS to monitor only the files inside the `assets` directory, set:  
   `FLOWS_TO_READ = ['www.example.com/ui/project13/assets'];`

2. **Monitor all projects within `/ui`:**  
   To monitor all directories and files inside `/ui`, set:  
   `FLOWS_TO_READ = ['www.example.com/ui'];`

3. **Monitor specific projects (e.g., `project13` and `project01`):**  
   To monitor only `project13` and `project01`, configure:  
   `FLOWS_TO_READ = ['www.example.com/ui/project13', 'www.example.com/ui/project01'];`

With these configurations, ProDS will monitor the specified directories (including files indide depth directories).
