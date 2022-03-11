import { Spacer, Wrapper } from '@/components/Layout';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './UploadDevice.module.css';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import * as constants from '@/page-components/constants';


// const s3BucketUrl = "https://hellocdkstack-myfirstbucketb8884501-1teu86nqr4njm.s3.ap-southeast-1.amazonaws.com/"

const DeviceCard = (device) => {
    const selectedDevice = device.device
    console.log('selectedDevice:', selectedDevice)

    // Format Device Name
    let deviceName = selectedDevice.Key.replace('devices/', '')
    console.log('deviceName:', typeof (deviceName))
    if (deviceName.includes('.jpeg')) deviceName = deviceName.replace('.jpeg', '')
    else if (deviceName.includes('.jpg')) deviceName = deviceName.replace('.jpg', '')
    else if (deviceName.includes('.png')) deviceName = deviceName.replace('.png', '')

    // Format LastModified DateTime
    const lastModDT = new Date(selectedDevice.LastModified)

    // Colors
    const lightGray = "#F0F0F0"

    return (
        <Card sx={{ maxWidth: 275 }} >
            <CardMedia
                component="img"
                height="150"
                image={`${constants.S3_BUCKET_URL + selectedDevice.Key}`}
                // image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                alt={`${constants.S3_BUCKET_URL + selectedDevice.Key}`}
            />
            <CardContent style={{ backgroundColor: "gray" }}>
                <Typography gutterBottom variant="h5" component="div">
                    {deviceName}
                </Typography>
                <Typography variant="body1" color={lightGray}>
                    BodyText
                </Typography>
                <Typography variant="subtitle2" color={lightGray}>Last modified: </Typography>
                <Typography variant="subtitle2" color={lightGray}>
                    {`${lastModDT.getDate()}-${lastModDT.getMonth() + 1}-${lastModDT.getFullYear()}, 
                    ${lastModDT.getHours()}:${lastModDT.getMinutes()}:${lastModDT.getSeconds()}`}
                </Typography>
            </CardContent>
            {/* <CardActions>
                <Button variant="contained" size="small">ToDo</Button>
            </CardActions> */}
        </Card>
    );
}


const UploadDevice = () => {
    const router = useRouter();

    const [objUrl, setObjUrl] = useState('');
    const [imgFormData, setImgFormData] = useState(null);
    const [currentFileName, setCurrentFileName] = useState('');
    const [devicesArray, setDevicesArray] = useState([])

    const uploadPhoto = async (e) => {
        const file = e.target.files[0];
        const filename = encodeURIComponent(file.name);
        setCurrentFileName(filename);
        const res = await fetch(`/api/aws-s3/upload-url?file=${filename}`);
        // console.log('res:', res)
        const { url, fields } = await res.json();
        const formData = new FormData();

        Object.entries({ ...fields, file }).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // console.log('url:', url)
        // const upload = await fetch(url, {
        //     method: 'POST',
        //     body: formData,
        // });

        // if (upload.ok) {
        //     console.log('Uploaded successfully!');
        // } else {
        //     console.error('Upload failed.');
        // }

        setObjUrl(url);
        setImgFormData(formData);
    };

    const confirmUpload = async () => {
        const upload = await fetch(objUrl, {
            method: 'POST',
            body: imgFormData,
        });

        if (upload.ok) {
            // page refresh
            router.reload(window.location.pathname)
            console.log('Uploaded successfully!');

        } else {
            console.error('Upload failed.');
        }
    }


    useEffect(async () => {
        const res = await fetch(`/api/aws-s3/listobjects-url`);
        const objArray = await res.json();
        setDevicesArray(objArray);

    }, [])


    return (
        <Wrapper>
            <h3>Add a device photo</h3>
            <p>This page contains a repository of the photos to use for the devices.</p>
            <p className={styles.instructionText}>Upload a .png or .jpg image (max 1MB).</p>
            <Input className={styles.fileSelectBtn}
                type="file"
                accept="image/png, image/jpeg"
                onChange={uploadPhoto}
            />
            <Box className={styles.container}>
                <p><b>File: {currentFileName}</b></p>
                <Spacer size={18} axis="horizontal" />
                <Button
                    // style={{
                    //     borderRadius: 12,
                    //     backgroundColor: "#0045AB",
                    //     padding: "12px 12px",
                    //     fontSize: "16px"
                    // }}
                    size="small"
                    variant="contained"
                    onClick={confirmUpload}
                >Upload</Button>
            </Box>

            <Spacer size={2} axis="vertical" />
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                {devicesArray.map((device) => (
                    <div>
                        {/* <Grid item xs={14}> */}
                            <DeviceCard device={device} />
                        {/* </Grid> */}
                    </div>
                ))
                }
            </Stack>
        </Wrapper >
    )
}


export default UploadDevice;