import { findDeviceById } from "@/api-lib/db";
import { database } from '@/api-lib/middlewares';
import { Input } from '@/components/Input';
import { Spacer } from '@/components/Layout';
import { fetcher } from "@/lib/fetch";
import { useCurrentUser } from '@/lib/user';
import nc from 'next-connect';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../../../page-components/Devices/DeviceList.module.css"
import toast from "react-hot-toast";
// MUI
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
// Chakra
import {
    AspectRatio, Avatar,
    Box, Button, Center, Flex, FormLabel,
    Heading, Image, Stack, styled, StylesProvider,
    Text
} from '@chakra-ui/react';


export default function UserDevicePage({ device }) {
    console.log('UserDevicePage, device:', device);
    const { data, error, mutate } = useCurrentUser();

    const [isLoading, setIsLoading] = useState(false);
    const nameRef = useRef();
    const energyRef = useRef();

    const router = useRouter();

    // Toggle Switch
    const [switchState, setSwitchState] = useState(false);
    const handleChange = (event) => {
        switchState ? setSwitchState(false) : setSwitchState(true);
    };

    useEffect(() => {
        nameRef.current.value = device.name
    }, [])

    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            try {
                setIsLoading(true);
                // const formData = new FormData();
                // formData.append('name', nameRef.current.value);
                const response = await fetcher('/api/device', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        _id: device._id,
                        name: nameRef.current.value,
                        energy: parseInt(energyRef.current.value),
                    }),
                });
                mutate({ user: response.user }, false);
                toast.success('The device has been updated');
                router.replace('/devices')
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
                        <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
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
                    <Flex justify={'center'} mt={-80}>
                        <Avatar
                            boxSize='180px'
                            size={'xl'}
                            opacity='0.9'
                            src={'https://images.unsplash.com/photo-1529310399831-ed472b81d589?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'}
                            alt={'Device'}
                            css={{
                                border: '1px solid gray',
                            }}
                        />
                    </Flex>

                    <Box p={6}>
                        <Stack spacing={-10} align={'center'} mb={1}>
                            <Text color={'gray.500'}>Added by: <b>{device.creator.username}</b></Text>
                            <Text color={'gray.500'}>from <b>{device.creator.company}</b></Text>
                        </Stack>
                    </Box>

                    <form onSubmit={onSubmit}>
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
    console.log("DeViCe:", device)
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