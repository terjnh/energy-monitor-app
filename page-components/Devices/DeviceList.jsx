import { Device } from '@/components/Device';
import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { usePostDevice } from '@/lib/device';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './DeviceList.module.css';
import { Box } from '@mui/material';

// Displays all devices
const DeviceList = () => {
    const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostDevice();
    const devices = data
        ? data.reduce((acc, val) => [...acc, ...val.devices], [])
        : [];

    console.log("DeviceList---devices:", devices)

    return (
        <div className={styles.root}>
            <Spacer axis="vertical" size={1} />
            <Wrapper>
                {devices.length !== 0
                    ? devices.map((device) => (
                        <>
                            <div className={styles.wrap}>
                                <Device className={styles.device} device={device} />
                            </div>

                        </>
                    ))
                    : (<Box sx={{ mt: -2, ml: 60 }}>
                        <CircularProgress/>
                        </Box>)}
            </Wrapper>
        </div>
    )
}

export default DeviceList;