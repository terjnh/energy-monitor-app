### Update:
- 10 Mar 2022:
    - Update device picture based on options available in S3 bucket '/devices'
        - selection of picture from modal

## Dependencies
- `ajv` - validates request body (JSON)
- `next.js` v9.3 or above required for API routes:
    - new data fetching method: https://nextjs.org/docs/basic-features/data-fetching/overview#getserversideprops-server-side-rendering
- Modern UI frameworks:
    - `chakra-ui`
    - `material-ui`
- `recharts`
    - $ npm install recharts
- `cloudinary` - for image/media handling
- `clsx`- a utility for constructing 'className' strings conditionally
- `lukeed/ms` - utility to convert milliseconds to and from string
- `express`
- `mongoose`
- `ejs`
- `multer`

### AWS Instructions ###
- `aws-cdk` - @aws-cdk/aws-s3
    - $ npm install -g aws-cdk
- After running the above command aws-cdk will be installed. Run the following command to verify correct installation and print the version number of the AWS CDK.
    - $ cdk --version
- Need to run $ cdk deploy (refer to package.json)
**Create an S3 bucket.**
1. Create a new [IAM role](https://aws.amazon.com/iam/) with permission for `AWSCloudFormationFullAccess` and `AmazonS3FullAccess`.
1. Save the access key and secret key.
1. Install the [AWS CLI](https://aws.amazon.com/cli/) and run `aws configure`.
1. This will prompt you to enter the access key and secret key.
1. Create an `.env.local` file similar to `.env.example`.
1. Run `cdk deploy` to create an S3 bucket with the correct CORS settings.
1. Visit your newly created S3 bucket and retrieve the name and region.
1. Add the name and region to `.env.local`.
1. Run `yarn dev` to start the Next app at `localhost:3000`.
1. Choose a `.png` or `.jpg` file.
1. You should see your file successfully uploaded to S3.
This example uses [`createPresignedPost`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createPresignedPost-property) instead of [`getSignedUrlPromise`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrlPromise-property) to allow setting max/min file sizes with `content-length-range`.
**Commands:**
- `cdk deploy` – Deploy this stack to your default AWS account/region
- `cdk diff` – Compare deployed stack with current state
- `cdk synth` – Emits the synthesized CloudFormation template

## Environment Variables:
- ACCESS_KEY, SECRET_KEY, REGION, and BUCKET_NAME belong to AWS


### TODO:
- Delete photo from Cloudinary if not in use


## Description
Referenced from: https://github.com/hoangvvo/nextjs-mongodb-app