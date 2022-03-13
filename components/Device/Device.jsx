import { Spacer } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { fetcher } from "@/lib/fetch";
import { useCurrentUser } from '@/lib/user';
import {
    Center, Grid, GridItem,
} from '@chakra-ui/react';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

import { format } from '@lukeed/ms';
import clsx from 'clsx';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import toast from "react-hot-toast";
import styles from './Device.module.css';
import { useRouter } from 'next/router';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};


const Device = ({ device, className }) => {
    // console.log("Device - device:", device)

    const timestampTxt = useMemo(() => {
        const diff = Date.now() - new Date(device.createdAt).getTime();
        if (diff < 1 * 60 * 1000) return 'Just now';
        return `${format(diff, true)} ago`;
    }, [device.createdAt])

    const { mutate } = useCurrentUser();
    const router = useRouter();

    // Modal (Delete confirmation)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: "#5C5C5C",
        '&:hover': {
            backgroundColor: "#FE2424",
        },
    }));

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const onDelete = async () => {
        // console.log('onDelete-id:', id)
        if (device._id) {
            // const body = { deviceId: id }
            // console.log("JSON.stringify:", JSON.stringify(body))

            const response = await fetcher(`/api/devices/${device._id}`, {
                method: 'DELETE',
            });
            console.log('onDelete, response:', response)
            if (response) {
                toast.success(response.message)
                handleClose();
                // page refresh
                router.reload(window.location.pathname)
            }
        } else {
            toast.error("Delete failed")
        }
    };




    return (
        <div className={clsx(styles.root, className)}>
            <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                <GridItem w='100%' column className={styles.meta}>
                    <p className={styles.username}>Username: {device.creator.username}</p>
                    <div className={styles.wrap}>
                        <p className={styles.content}>Name: {device.name}</p>
                    </div>
                    <div className={styles.wrap}>
                        <time dateTime={String(device.createdAt)} className={styles.timestamp}>
                            - device added {timestampTxt} -
                        </time>
                    </div>
                </GridItem>
                <GridItem w='100%' column className={styles.meta}>
                    <div className={styles.wrap}>
                        <p className={styles.content}>Energy consumed this month: -- W</p>
                        <p className={styles.content}>Total energy consumed: --- W</p>
                    </div>
                </GridItem>
                <GridItem w='100%' column className={styles.meta}>
                    <Spacer axis="vertical" size={0.4} />
                    <div className={styles.wrap}>
                        <Center>
                            <Link
                                key={device._id}
                                href={`/user/${device.creator.username}/device/${device._id}`}
                                passHref
                            >
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        setIsEditing(true);
                                    }}>
                                    Edit {isEditing ? <LoadingDots> </LoadingDots> : null}
                                </Button>
                            </Link>
                            <Spacer axis="horizontal" size={0.2} />
                            {/* <button className={styles.deletebtn}
                                onClick={() => onDelete(device._id)}>Delete</button> */}
                            <Button color="error" variant="contained"
                                onClick={handleOpen}>Delete</Button>
                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                open={open}
                                onClose={handleClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{ timeout: 500, }}
                            >
                                <Fade in={open}>
                                    <Box sx={style}>
                                        <Typography id="transition-modal-title" color="#4B4B4B" variant="h6" component="h2">
                                            Deleting Device
                                        </Typography>
                                        <Typography id="transition-modal-description"
                                            color="#4B4B4B"
                                            sx={{ mt: 1 }}>
                                            Are you sure ?
                                        </Typography>
                                        <ColorButton sx={{ mt: 2, ml: 20 }} variant="contained"
                                            onClick={handleClose}>No</ColorButton>
                                        <ColorButton sx={{ mt: 2, ml: 2 }} variant="contained"
                                            onClick={() => {
                                                onDelete()
                                            }}>Yes</ColorButton>
                                    </Box>
                                </Fade>
                            </Modal>
                        </Center>
                    </div>
                </GridItem>
            </Grid>

        </div>
    )
}

export default Device;