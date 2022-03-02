import { Spacer, Wrapper } from '@/components/Layout';
import { usePostDevice } from '@/lib/device';
import { Center, Text } from '@chakra-ui/react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import React, { useEffect, useState } from 'react';
import {
    CartesianGrid, Legend,
    Line, LineChart,
    Tooltip, XAxis, YAxis
} from 'recharts';
import styles from './Chart.module.css';


export const Chart = () => {
    const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostDevice();

    const [energyList, setEnergyList] = useState([]);
    const [energyObjs, setEnergyObjs] = useState([]);
    const [energySum, setEnergySum] = useState([]);
    const devices = data
        ? data.reduce((acc, val) => [...acc, ...val.devices], [])
        : [];


    useEffect(() => {
        let deviceEnergyArray = [];
        for (let idx in devices) {
            deviceEnergyArray.push(devices[idx].energyConsumption);
        }
        setEnergyList(deviceEnergyArray);
        calculateTotalEnergy(devices);
    }, [data])

    useEffect(() => {
        // console.log('Render: Update-Chart')
        updateChart(energyList);

        console.log("energySum:", energySum)
        energySum.map((device, idx) => {
            console.log('device:', device)
        })
    }, [energyList, energySum])


    const updateChart = (energyList) => {
        let deviceArray = []
        let deviceArrayLength = 0;
        for (let idx in energyList) {
            if (deviceArrayLength < energyList[idx].length)
                deviceArrayLength = energyList[idx].length;
        }
        // graph resolution determined by device with longest energy consumption array
        for (let j = 0; j < deviceArrayLength; j++) {
            let deviceAdd = {}
            for (let i in energyList) {
                deviceAdd = {
                    ...deviceAdd,
                    [devices[i].name]: energyList[i][j]
                }
            }
            deviceArray.push(deviceAdd)
        }
        setEnergyObjs(deviceArray);
    }


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
        }
    ];


    const Item = styled(Paper)(({ theme }) => ({
        // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        backgroundColor: '#2B2B2B',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        // color: theme.palette.text.primary,
        fontSize: '16px',
    }));


    const calculateTotalEnergy = (devices) => {
        let sumArray = []
        devices.map((device, idx) => {
            console.log('------')
            let sumObj = {}
            let sum = 0;
            device.energyConsumption.map((num) => {
                sum += parseInt(num);
            })
            sumObj.name = device.name
            sumObj.energySum = sum
            sumArray.push(sumObj);
        })
        setEnergySum(sumArray);
    }
    const DeviceDetails = () => {
        /* <Text color="white" fontSize='sm'><b>Device: {device.name}</b></Text>
                <Text color="white" fontSize='sm'>Creator: {device.creator.name}</Text> */
        return (
            <>
                {energySum.map((device, idx) => (
                    <>
                        <Text color="white"><b>{device.name}</b></Text>
                        <Text color="white" className={styles.fontSmall}>Total: {device.energySum} W</Text>
                        <Spacer size={0.4} axis="vertical" /></>
                ))}
            </>
        )
    }


    const colorArray = ["#FF6B6B", "#FFC64D", "#56FF41",
        "#2D32FF", "#26E0DC", "#858989",]
    const chartLines = (devices) => {
        return (
            <>
                {devices.map((device, idx) => (
                    // <Line type="monotone" dataKey={device ? device.name : ''} stroke={colorArray[idx%6]} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey={device ? device.name : ''} stroke={colorArray[idx % 6]} />
                ))}
            </>
        )
    }


    return (
        <>
            <Box ml={10} justify='center' sx={{ flexGrow: 1 }}>
                <h1>Summary</h1>
                <Grid container spacing={2} justify='center'>
                    <Grid item xs={6} ml={4} md={2}>
                        <Item key={4} elevation={4}>
                            {DeviceDetails()}
                        </Item>
                    </Grid>
                    {/* <Spacer size={1} axis="vertical" /> */}
                    <Grid item xs={2} md={8}>
                        <Item key={4} elevation={4}>
                            <Center w='600'>
                                <Text color="white"><b>Device energy usage (watts)</b></Text>
                            </Center>
                            <Spacer size={0.2} axis="vertical" />
                            <LineChart
                                width={600}
                                height={250}
                                data={energyObjs}

                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {chartLines(devices)}
                                {/* <Line type="monotone" dataKey={devices[0] ? devices[0].name : ''} stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey={devices[1] ? devices[1].name : ''} stroke="#82ca9d" /> */}
                                {/* <Line type="monotone" dataKey="2" stroke="#e5e5e5" /> */}
                            </LineChart>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
};
