import { findDeviceById } from "@/api-lib/db";
import nc from 'next-connect';
import { database } from '@/api-lib/middlewares';
import { fetcher } from "@/lib/fetch";
import { useCurrentUser } from '@/lib/user';

import { Avatar } from '@/components/Avatar';
import { Input } from '@/components/Input';
import { Spacer } from '@/components/Layout';
import * as constants from '@/page-components/constants';
// Chakra
import {
    AspectRatio,
    Center, Flex, Heading, Image, Stack, Text
} from '@chakra-ui/react';
// MUI
import Switch from '@mui/material/Switch';
import { Button } from "@mui/material";
import { makeStyles } from '@mui/styles';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';

import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import styles from "../../../../page-components/Devices/DeviceList.module.css";
import { borderRadius } from "@mui/system";


export default function UserDevicePage({ device }) {
    // console.log('UserDevicePage, device:', device);
    const { data, error, mutate } = useCurrentUser();

    const [isLoading, setIsLoading] = useState(false);
    const [avatarHref, setAvatarHref] = useState(device.photo);
    const [avatarHref2, setAvatarHref2] = useState(device.photoUrl);
    const nameRef = useRef();
    const energyRef = useRef();
    const devicePictureRef = useRef();
    const devicePicture2Ref = useRef();
    const [s3DevicesArray, setS3DevicesArray] = useState([]);

    const router = useRouter();


    // Modal - on/off switch
    const [openOnOffModal, setOpenOnOffModal] = useState(false);
    const [isUpdatingOnOff, setIsUpdatingOnOff] = useState(false);
    const onCloseOnOffModal = () => {
        // switchState ? setSwitchState(false) : setSwitchState(true)
        setOpenOnOffModal(false);
    }
    const onOpenOnOffModal = () => setOpenOnOffModal(true);

    // Toggle Switch
    const [switchState, setSwitchState] = useState(device.switchState);
    const handleChange = () => {
        switchState ? setSwitchState(false) : setSwitchState(true)
        onCloseOnOffModal();
    };
    useEffect(() => {
        console.log('useEffect -switchState:', switchState)
        async function editSwitchState(_id, switchState) {
            const response = await fetcher('/api/device/switch-state', {
                method: 'PATCH',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    _id: _id,
                    switchState: switchState
                })
            });
        }
        // TODO: switchstate changes, enable loading state, update MongoDB
        // Update MongoDB key-value for device
        try {
            setIsUpdatingOnOff(true);
            // console.log('isUpdatingOnOff:', isUpdatingOnOff)
            // const formData = new FormData();
            // formData.append('_id', device._id);
            // formData.append('switchState', switchState)

            editSwitchState(device._id, switchState);
            toast.success("Success")
        } catch (e) {
            toast.error(e.message);
        } finally {
            setIsUpdatingOnOff(false);
            // console.log('isUpdatingOnOff:', isUpdatingOnOff)
        }
    }, [switchState])


    // Modal - select photo
    const [openPhotoModal, setOpenPhotoModal] = useState(false);
    const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
    const [photoSelected, setPhotoSelected] = useState('');
    const onClosePhotoModal = () => setOpenPhotoModal(false);
    const onOpenPhotoModal = async () => {
        setOpenPhotoModal(true);
        setIsLoadingPhotos(true);
        // fetch data from s3
        try {
            const res = await fetch(`/api/aws-s3/listobjects-url`);
            const objArray = await res.json();
            setS3DevicesArray(objArray);
            toast.success("fetched images from s3")
        } catch (e) {
            toast.error("unable to fetch images")
        } finally {
            setIsLoadingPhotos(false);
        }
    }
    const handlePhotoSelected = (event) => {
        setPhotoSelected(event.target.value);
    };




    useEffect(() => {
        nameRef.current.value = device.name;
        devicePicture2Ref.current.value = '';
        setAvatarHref(device.photo)
    }, [device])

    const onDevicePictureChange = useCallback((e) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (l) => {
            setAvatarHref(l.currentTarget.result);
        };
        reader.readAsDataURL(file);
    })

    const onDevicePictureChange2 = useCallback((e) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return
    })

    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('_id', device._id);
                formData.append('name', nameRef.current.value);
                formData.append('energy', energyRef.current.value);
                // console.log('devicePicture2Ref:', devicePicture2Ref.current.style.backgroundImage)
                // if (devicePictureRef.current.files[0]) {
                //     // console.log('devicePictureRef.current.files[0]:', devicePictureRef.current.files[0])
                //     formData.append('photo', devicePictureRef.current.files[0])
                // }
                if (devicePicture2Ref.current) {
                    // Slice url
                    const photoUrl = devicePicture2Ref.current.style.backgroundImage
                    let photoUrl2 = photoUrl.slice(5)
                    let photoUrlMod = photoUrl2.slice(0, photoUrl2.length - 2)
                    formData.append('photoUrl', photoUrlMod)
                }
                // console.log('Device-formData:', formData.get('photo'))

                const response = await fetcher('/api/device', {
                    method: 'PATCH',
                    body: formData,
                });
                mutate({ user: response.user }, false);
                toast.success('The device has been updated');
                // router.replace('/devices')
            } catch (e) {
                toast.error(e.message)
            } finally {
                setIsLoading(false);
            }
        }, [mutate]
    );





    ///// MODALS /////
    const photoModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 450,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
    };
    const PhotoModal = () => {
        return (
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openPhotoModal}
                onClose={onClosePhotoModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500, }}
            >
                <Fade in={openPhotoModal}>
                    <Box sx={photoModalStyle}>
                        <Typography id="transition-modal-title" color="#4B4B4B" variant="h6" component="h2">
                            Select a photo
                        </Typography>
                        <Spacer size={0.5} axis="vertical" />
                        <FormControl>
                            <RadioGroup
                                id="radio-buttons-group"
                                aria-labelledby="controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={photoSelected}
                                onChange={handlePhotoSelected}
                            >
                                <Grid container rowSpacing={1} columnSpacing={1}>
                                    {isLoadingPhotos
                                        ? <Box sx={{ ml: 20, mt: 6, mb: 6 }}>
                                            <CircularProgress />
                                        </Box>
                                        : s3DevicesArray.map((device) => (
                                            <>
                                                <Grid item xs={3}>
                                                    <Avatar size={100}
                                                        alt={device.Key}
                                                        url={constants.S3_BUCKET_URL + device.Key}
                                                    />
                                                    <Spacer size={0.1} axis="vertical" />
                                                    <FormControlLabel sx={{ ml: 4 }}
                                                        value={device.Key}
                                                        control={<Radio />}
                                                        label={device.Key}
                                                    />
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                                <Box>
                                    <Button sx={{ mt: -2, ml: 40 }}
                                        variant="contained"
                                        color="error"
                                        onClick={onClosePhotoModal}>Cancel</Button>
                                    <Button sx={{ mt: -2, ml: 2 }} variant="contained"
                                        onClick={() => {
                                            console.log("photoSelected:", photoSelected)
                                            setAvatarHref2(constants.S3_BUCKET_URL + photoSelected)
                                            onClosePhotoModal();
                                        }}>Select</Button>
                                </Box>
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Fade>
            </Modal >
        )
    }

    const onOffModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        height: 180,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
    };
    const OnOffSwitchModal = () => {
        return (
            <Modal
                open={openOnOffModal}
                onClose={onCloseOnOffModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500, }}
            >
                <Fade in={openOnOffModal}>
                    <Box sx={onOffModalStyle}>
                        <Typography id="transition-modal-title" color="#4B4B4B" variant="h6" component="h2">
                            Switch the device?
                        </Typography>
                        <Spacer size={0.5} axis="vertical" />
                        <Box>
                            <Button sx={{ mt: 3, ml: 16 }}
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    onCloseOnOffModal()
                                }}
                            >
                                No</Button>
                            <Button sx={{ mt: 3, ml: 2 }} variant="contained"
                                onClick={() => {
                                    handleChange();
                                }}>Yes</Button>
                        </Box>
                    </Box>
                </Fade>


            </Modal>
        )
    }







    const buttonStyle = {
        imageContainer: {
            backgroundImage: `url(${avatarHref2})`,
            width: '150px',
            height: '150px',
            backgroundSize: 'cover',
            borderRadius: '20px'
        }
    }

    return (
        <>
            <Center py={6}>
                <Box
                    maxW={'800px'}
                    w={'full'}
                    // bg={useColorModeValue('white', 'gray.800')}
                    boxShadow={'2xl'}
                    rounded={'md'}
                    overflow={'hidden'}>

                    <Box p={4}>
                        <Flex justify={'center'} mt={0} mb={-20}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        sx={{ mt: -0.75, mr: 1 }}
                                        checked={switchState}
                                        onChange={() => {
                                            onOpenOnOffModal();
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        name="switch" />
                                }
                                label={switchState ?
                                    <Typography variant='h5'><b>ON</b></Typography>
                                    : <Typography variant='h5'><b>OFF</b></Typography>}
                            /></Flex>
                    </Box>

                    <Stack spacing={0} align={'center'} mb={2}>
                        <Heading fontSize={'xl'} fontWeight={400} fontFamily={'body'}>
                            Selected Device:
                        </Heading>
                    </Stack>

                    {/* <AspectRatio ratio={6 / 3}>
                        <Image
                            h={'120px'}
                            w={'full'}
                            opacity='0.6'
                            src={
                                'https://images.unsplash.com/photo-1556401615-c909c3d67480?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
                            }
                            objectFit={'cover'}
                        /></AspectRatio> */}

                    <form onSubmit={onSubmit}>
                        <Flex justify={'center'} mt={-60} ml={-52}>
                            <Spacer size={0.5} axis="vertical" />
                            <div className={styles.avatar}>
                                <Spacer size={2.5} axis="vertical" />
                                <Button style={buttonStyle.imageContainer}
                                    // className={styles.buttonStep}
                                    ref={devicePicture2Ref}
                                    onClick={() => {
                                        onOpenPhotoModal();
                                    }}
                                />
                            </div>

                        </Flex>
                        <Spacer size={3} axis="vertical" />
                        <Box p={6}>
                            <Stack spacing={-10} align={'center'} mb={1}>
                                <Text color={'gray.500'}>Added by: <b>{device.creator.username}</b></Text>
                                <Text color={'gray.500'}>from <b>{device.creator.company}</b></Text>
                            </Stack>
                        </Box>

                        <Input ref={nameRef} label="Device name" />
                        <Spacer size={0.5} axis="vertical" />
                        <Input ref={energyRef} label="Add Energy (Watts)" />
                        <Spacer size={0.5} axis="vertical" />
                        <button className={styles.submitbutton}
                            htmlType="submit"
                            type="success"
                            loading={isLoading}
                        >
                            Save
                        </button>
                        <Spacer size={2} axis="vertical" />
                    </form>

                </Box>
            </Center>

            <PhotoModal />
            <OnOffSwitchModal />
        </>
    )
}


export async function getServerSideProps(context) {
    await nc().use(database).run(context.req, context.res);

    const device = await findDeviceById(context.req.db, context.params.deviceId);
    if (!device) {
        return {
            notFound: true,
        };
    }

    if (context.params.username !== device.creator.username) {
        // mismatch params in url, redirect to correct one
        // eg. post x belongs to user a, but url is /user/b/post/x
        return {
            redirect: {
                destination: `/user/${device.creator.username}/device/${device._id}`,
                permanent: false,
            },
        };
    }

    device._id = String(device._id);
    device.creatorId = String(device.creatorId);
    device.creator._id = String(device.creator._id);
    device.createdAt = device.createdAt.toJSON();
    return { props: { device } }
}






