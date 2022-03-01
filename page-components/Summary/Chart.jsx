import { Spacer, Wrapper } from '@/components/Layout';
import { Device } from '@/components/Device';
import { usePostDevice } from '@/lib/device';
import { Center, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import {
    CartesianGrid, Legend,
    Line, LineChart,
    Tooltip, XAxis, YAxis,
    ResponsiveContainer
} from 'recharts';
import styles from './Chart.module.css';


export const Chart = () => {
    const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostDevice();

    const [energyList, setEnergyList] = useState([]);
    const [energyObjs, setEnergyObjs] = useState([]);
    const devices = data
        ? data.reduce((acc, val) => [...acc, ...val.devices], [])
        : [];


    useEffect(() => {
        let deviceEnergyArray = [];
        for (let idx in devices) {
            deviceEnergyArray.push(devices[idx].energyConsumption);
        }
        setEnergyList(deviceEnergyArray);
    }, [data])

    const mockData = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        }
    ];

    return (
        <>
            <Wrapper>
                <div className={styles.root}>
                    <Wrapper>
                        {devices.map((device) => (
                            <p>NAME:{device.name}</p>
                        ))}
                    </Wrapper>
                    <button onClick={() => {
                        let deviceArray = []
                        console.log('energyList:', energyList)
                        
                        // *energyList[0].length determines graph resolution
                        for (let j in energyList[0]) {
                            let deviceAdd = {}
                            for (let i in energyList) {
                                deviceAdd = {
                                    ...deviceAdd,
                                    [devices[i].name]: energyList[i][j]
                                }
                            }   
                            console.log('deviceAdd:', deviceAdd)
                            deviceArray.push(deviceAdd)
                        }
                        setEnergyObjs(deviceArray);
                    }}>Update graph</button>

                    <Spacer size={1} axis="vertical" />
                    <Center w='1125px'>
                        <Text color="secondary"><b>Mock Summary Chart</b></Text>
                    </Center>
                    <Spacer size={0.2} axis="vertical" />
                    <LineChart
                        width={800}
                        height={250}
                        data={energyObjs}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 300,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={devices[0] ? devices[0].name : ''} stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey={devices[1] ? devices[1].name : ''} stroke="#82ca9d" />
                        {/* <Line type="monotone" dataKey="2" stroke="#e5e5e5" /> */}
                    </LineChart>
                </div>
            </Wrapper>
        </>
    )
};
