import { Box, Center, Flex, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { Spacer } from '@/components/Layout';
import { DeleteIcon } from '@chakra-ui/icons';
import toast from "react-hot-toast";

import { format } from '@lukeed/ms';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import styles from './Device.module.css';
import Link from 'next/link';

import { fetcher } from "@/lib/fetch";

const Device = ({ device, className }) => {
    // console.log("Device - device:", device)

    const timestampTxt = useMemo(() => {
        const diff = Date.now() - new Date(device.createdAt).getTime();
        if (diff < 1 * 60 * 1000) return 'Just now';
        return `${format(diff, true)} ago`;
    }, [device.createdAt])

    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = useCallback(
        async (e) => {
            e.preventDefault();
            try {
                setIsDeleting(true);
                const deviceId = device._id.toString()
                const response = await fetcher('/api/device', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        deviceId: deviceId
                    }),
                });
            } catch (e) {
                toast.error(e.message)
            } finally {
                setIsDeleting(false);
            }
        }, []
    );

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
                                <button className={styles.editbtn}
                                    onClick={() => {
                                        console.log("EDIT")
                                    }}>Edit</button>
                            </Link>
                            <Spacer axis="horizontal" size={0.2} />
                            <button className={styles.deletebtn}
                                onClick={onDelete}>Delete</button>
                        </Center>
                    </div>
                </GridItem>
            </Grid>
        </div>
    )
}

export default Device;