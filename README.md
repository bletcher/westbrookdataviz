# Westbrook Data Visualization

A collection of data visualization applications built with Observable Framework.

## Project Structure

```
westbrookdataviz/
├── src/
│   ├── components/
│   │   ├── cases.js         # Case cards and filtering logic
│   │   └── header.js        # Header component
│   ├── data/
│   │   └── *.png            # Card images
│   └── index.md             # Main page
├── dist/                    # Built files
├── invalidate.ps1          # CloudFront cache invalidation script (to see changes immediately)
└── package.json            # Project configuration
```

## Development

### Prerequisites

- Node.js 18 or later
- npm
- AWS CLI configured with appropriate credentials

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Features

The main page features a collection of interactive data visualization applications organized into categories:

- **Data Stories**: Interactive data visualization stories
- **Data Explorers**: Interactive data exploration tools
- **Music**: Music-related visualizations and tools

### Adding New Cases

To add a new case to the collection:

1. Add the image to `src/data/` directory
2. Update the image imports in `src/components/cases.js`:
```javascript
const NEW_IMAGE = FileAttachment("/data/new_image.png");
```

3. Add the image to the images object:
```javascript
export const images = {
  // ... existing images ...
  newCase: NEW_IMAGE
};
```

4. Add the case to the cases array:
```javascript
export async function createCases(images) {
  return [
    // ... existing cases ...
    {
      title: "New Case Title",
      category: "category", // "dataStory", "dataExplorer", or "music"
      image: images.newCase,
      description: "Description of the case",
      url: "https://example.com"
    }
  ];
}
```

## Deployment

The site is deployed using AWS S3 and CloudFront. The deployment process involves:

1. Building the application
2. Uploading the built files to S3 (manually or using AWS Console)
3. Invalidating the CloudFront cache to make changes visible immediately

Used [this](https://dev.to/1zyik/host-a-static-website-on-aws-using-s3-route-53-aws-certificate-manager-and-cloudfront-3mi6) tutorial to set up the pipeline.  


### Cache Invalidation

After uploading files to S3, copy the invalidate.ps1 file into the root and add `"invalidate-cache": "powershell -File invalidate.ps1",` to package.json in "scripts", then run the cache invalidation script:
```bash
npm run invalidate-cache
```

This will:
- Create a CloudFront invalidation
- Monitor the invalidation progress
- Show when the changes are visible

### AWS Infrastructure

- S3 bucket: `westbrookdataviz.org`
- CloudFront distribution for content delivery
- Route53 for DNS management
- ACM for SSL certificate

## Technologies Used

- [Observable Framework](https://observablehq.com/framework)
- HTML/JavaScript
- AWS S3 and CloudFront for hosting

## License

This project is open source and available under the MIT License.

## Local applications

1. **PIT Antenna Data Explorer**
   - Location: `pit_data/`
   - Description: Interactive visualization of PIT antenna data

2. **Set List Drums**
   - Location: `set-list-drums/`
   - Description: Song library and set list creator

 ## Development

### Prerequisites

- Node.js 18 or later
- npm
- AWS CLI (for deployment)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build a local app:
   ```bash
   npm run build
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Deployment

The site is deployed using AWS S3 and CloudFront. The deployment process involves:

1. Building the applications
2. Uploading the built files to S3
3. Serving the content through CloudFront

### Deployment Steps

For now, manually upload files in dist/ for each app.  

- Upload the files to the S3 bucket
- CloudFront will automatically serve the new content, after a moment.  

### AWS Infrastructure

The site uses the following AWS services:
- S3 bucket: `westbrookdataviz.org`
- CloudFront distribution for content delivery
- Route53 for DNS management
- ACM for SSL certificate

### Cache Control

The deployment script sets appropriate cache headers:
- Static assets (JS, CSS, images, fonts): 1 year cache
- HTML files: 5 minutes cache with stale-while-revalidate
- JSON data files: 1 hour cache with stale-while-revalidate
- Other files: 1 hour cache

## Project Structure

```
westbrookdataviz/
├── dist/                    # Final built files
├── pit_antenna_data_explorer/  # PIT data app
├── set-list-drums/         # Set list drums app
└── package.json            # Project configuration
```


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

<hr> 


This is an [Observable Framework](https://observablehq.com/framework) project. To start the local preview server, run:

```
npm run dev
```

Then visit <http://localhost:3000> to preview your project.

For more, see <https://observablehq.com/framework/getting-started>.


## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`            | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| `npm run deploy`     | Deploy your project to Observable                        |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |
