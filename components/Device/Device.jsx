import { Grid, GridItem } from '@chakra-ui/react';
import { format } from '@lukeed/ms';
import clsx from 'clsx';
import { useMemo } from 'react';
import styles from './Device.module.css';

const Device = ({ device, className }) => {
    // console.log("Device - device:", device)

    const timestampTxt = useMemo(() => {
        const diff = Date.now() - new Date(device.createdAt).getTime();
        if (diff < 1 * 60 * 1000) return 'Just now';
        return `${format(diff, true)} ago`;
    }, [device.createdAt])

    return (
        <div className={clsx(styles.root, className)}>
            <Grid templateColumns='repeat(2, 1fr)' gap={6}>
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
            </Grid>
        </div>
    )
}

export default Device;