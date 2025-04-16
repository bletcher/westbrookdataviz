# WestBrook DataViz

Site at: [westbrookdataviz.org](https://westbrookdataviz.org)

Setup steps:

## Enable command line R

Add .R and .RScript to [Path](https://info201.github.io/r-intro.html#windows-command-line). Will need to update the path when R version is updated.  5.2.1.1 Windows Command-Line

## Set up observable framework project

1) In the terminal, go to root directory (one below the subdirectory you will create in the next step).
2) Run `npm init "@observablehq"` and don't initialize git.
3) In vsCode, open the folder for the project and then publish to a new repo (from the `source control` badge).
4) Make changes for deploying suggested [here](https://observablehq.com/framework/deploying#other-hosting-services).  
5) In the terminal, run `npm run build` to build the site and associated apps in /dist and /dist/apps.  
6) Commit and push and github actions will update the site via AWS Amplify.  
7) make sure to enable static web hosting and to add a bucket policy like:
   {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::temperature-viewer/*"
        }
    ]
}

Notes:
1) To force rerun of cached objects, run: `rm docs/.observablehq/cache/data/*.*` with approriate changes for specific files or file types.    

## App Management System

This project uses a centralized app management system to handle multiple sub-applications. Each app is deployed as a subdirectory under the main domain (e.g., westbrookdataviz.org/apps/set-list-drums).

### Adding a New App

To add a new app to the project:

1. Add the app configuration to `manage-apps.js`:
```javascript
{
  name: 'app-name',
  source: '../app-repo',
  target: 'apps/app-name'
}
```

2. The app will be automatically:
   - Built during deployment
   - Deployed to the correct subdirectory
   - Accessible at westbrookdataviz.org/apps/app-name

### Deployment with GitHub Actions

This project uses GitHub Actions for automated deployment. When you push changes to the main branch:

1. The workflow will:
   - Build the main site
   - Build all sub-applications
   - Deploy to AWS Amplify

2. Required GitHub Secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AMPLIFY_APP_ID`: Your AWS Amplify app ID

To set up the secrets:
1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add each secret with its corresponding value

### Available Build Commands

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm run build`   | Build the main site                                      |
| `npm run build:apps` | Build all sub-applications                              |
| `npm run build:all` | Build both main site and all sub-applications           |

<hr> 


This is an [Observable Framework](https://observablehq.com/framework) project. To start the local preview server, run:

```
npm run dev
```

Then visit <http://localhost:3000> to preview your project.

For more, see <https://observablehq.com/framework/getting-started>.

## Project structure

A typical Framework project looks like this:

```ini
.
├─ src
│  ├─ components
│  │  └─ timeline.js           # an importable module
│  ├─ data
│  │  ├─ launches.csv.js       # a data loader
│  │  └─ events.json           # a static data file
│  ├─ example-dashboard.md     # a page
│  ├─ example-report.md        # another page
│  └─ index.md                 # the home page
├─ apps                        # sub-applications directory
│  └─ app-name                 # each app has its own directory
├─ manage-apps.js              # app management script
├─ .gitignore
├─ observablehq.config.js      # the project config file
├─ package.json
└─ README.md
```

**`docs`** - This is the "source root" — where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

**`docs/index.md`** - This is the home page for your site. You can have as many additional pages as you'd like, but you should always have a home page, too.

**`docs/data`** - You can put [data loaders](https://observablehq.com/framework/loaders) or static data files anywhere in your source root, but we recommend putting them here.

**`docs/components`** - You can put shared [JavaScript modules](https://observablehq.com/framework/javascript/imports) anywhere in your source root, but we recommend putting them here. This helps you pull code out of Markdown files and into JavaScript modules, making it easier to reuse code across pages, write tests and run linters, and even share code with vanilla web applications.

**`observablehq.config.js`** - This is the [project configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the project's title.

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`            | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| `npm run deploy`     | Deploy your project to Observable                        |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |

# Westbrook Data Visualization

A collection of data visualization projects and interactive apps.

## Adding New Apps

To add a new app to this project:

1. Add the app's repository URL to the `apps` array in `manage-apps.js`:
```javascript
const apps = [
  {
    name: 'set-list-drums',
    source: 'https://github.com/bletcher/set-list-drums.git',
    target: 'apps/set-list-drums'
  },
  // Add your new app here
  {
    name: 'your-app-name',
    source: 'https://github.com/your-username/your-repo.git',
    target: 'apps/your-app-name'
  }
];
```

2. Update the app's image in `src/index.md`:
```javascript
const images = {
  // ... existing images ...
  yourApp: FileAttachment("data/your_app_image.png"),
  // ... other images ...
};
```

3. Add the app to the cases in `src/components/cases.js`:
```javascript
const cases = [
  // ... existing cases ...
  {
    title: "Your App Title",
    description: "Description of your app",
    image: images.yourApp,
    link: "apps/your-app-name",
    category: "your-category" // e.g., "dataStory", "dataExplorer", "music"
  }
];
```

### Requirements for New Apps

1. The app must be a public GitHub repository
2. The app must have a `package.json` with build scripts
3. The app must build to a `dist` directory
4. The app should be self-contained and not require server-side components
5. Include a square image (preferably 400x400px) for the app card

### Build Process

When a new app is added:
1. The app's repository is cloned during the build process
2. Dependencies are installed using `npm install`
3. The app is built using `npm run build`
4. The built files are copied to the `dist/apps/your-app-name` directory
5. The app is deployed along with the main site

### Categories

Apps can be categorized as:
- `dataStory`: Data visualization stories
- `dataExplorer`: Interactive data exploration tools
- `music`: Music-related visualizations and tools

Choose the most appropriate category for your app when adding it to the cases array.
