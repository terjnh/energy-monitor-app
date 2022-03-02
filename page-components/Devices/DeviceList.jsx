import { Device } from '@/components/Device';
import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { usePostDevice } from '@/lib/device';
import Link from 'next/link';
import styles from './DeviceList.module.css';

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
                {devices.map((device) => (
                    <>
                        <div className={styles.wrap}>
                            <Device className={styles.device} device={device} />
                        </div>

                    </>
                ))}
            </Wrapper>
        </div>
    )
}

export default DeviceList;