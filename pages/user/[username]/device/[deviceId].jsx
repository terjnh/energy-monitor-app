import { findDeviceById } from "@/api-lib/db";
import nc from 'next-connect';
import { database } from '@/api-lib/middlewares';
import { fetcher } from "@/lib/fetch";
import { useCurrentUser } from '@/lib/user';

import { Avatar } from '@/components/Avatar';
import { Input } from '@/components/Input';
import { Spacer } from '@/components/Layout';
// Chakra
import {
    AspectRatio,
    Box, Center, Flex, Heading, Image, Stack, Text
} from '@chakra-ui/react';
import FormControlLabel from '@mui/material/FormControlLabel';
// MUI
import Switch from '@mui/material/Switch';

import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import styles from "../../../../page-components/Devices/DeviceList.module.css";


export default function UserDevicePage({ device }) {
    console.log('UserDevicePage, device:', device);
    const { data, error, mutate } = useCurrentUser();

    const [isLoading, setIsLoading] = useState(false);
    const [avatarHref, setAvatarHref] = useState(device.photo);
    const nameRef = useRef();
    const energyRef = useRef();
    const devicePictureRef = useRef();

    const router = useRouter();

    // Toggle Switch
    const [switchState, setSwitchState] = useState(false);
    const handleChange = (event) => {
        switchState ? setSwitchState(false) : setSwitchState(true);
    };

    useEffect(() => {
        nameRef.current.value = device.name;
        devicePictureRef.current.value = '';
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

    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('_id', device._id);
                formData.append('name', nameRef.current.value);
                formData.append('energy', energyRef.current.value);
                if (devicePictureRef.current.files[0]) {
                    formData.append('photo', devicePictureRef.current.files[0])
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

                    <Box p={6}><Flex justify={'center'} mt={10}>
                        <FormControlLabel
                            control={
                                <Switch checked={switchState} onChange={handleChange} name="switch" />
                            }
                            label={switchState ?
                                <b>Switch OFF</b> : <b>Switch ON</b>}
                        /></Flex>
                    </Box>

                    <Stack spacing={0} align={'center'} mb={5}>
                        <Heading fontSize={'xl'} fontWeight={400} fontFamily={'body'}>
                            Selected Device:
                        </Heading>
                    </Stack>

                    <AspectRatio ratio={6 / 3}>
                        <Image
                            h={'120px'}
                            w={'full'}
                            opacity='0.6'
                            src={
                                'https://images.unsplash.com/photo-1556401615-c909c3d67480?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
                            }
                            objectFit={'cover'}
                        /></AspectRatio>

                    <form onSubmit={onSubmit}>
                        <Flex justify={'center'} mt={-60} ml={-52}>
                            <Spacer size={0.5} axis="vertical" />
                            <div className={styles.avatar}>
                                <Avatar
                                    size={150}
                                    url={avatarHref ? avatarHref : '/images/addImage.png'}
                                />
                                <input
                                    aria-label="Device Avatar"
                                    type="file"
                                    accept="image/*"
                                    ref={devicePictureRef}
                                    onChange={onDevicePictureChange}
                                />
                            </div>
                        </Flex>
                        <Spacer size={2} axis="vertical" />
                        <Box p={6}>
                            <Stack spacing={-10} align={'center'} mb={1}>
                                <Text color={'gray.500'}>Added by: <b>{device.creator.username}</b></Text>
                                <Text color={'gray.500'}>from <b>{device.creator.company}</b></Text>
                            </Stack>
                        </Box>

                        <Spacer size={0.5} axis="vertical" />
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
                    </form>


                </Box>
            </Center>
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