import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';

import { View, StyleSheet, Text, Button } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat, scanBarcodes } from 'vision-camera-code-scanner';

export default function QRCode() {
    const [hasPermission, setHasPermission] = React.useState(false);
    const [captured, setCaptured] = React.useState(false);
    const devices = useCameraDevices();
    const device = devices.back;

    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
        checkInverted: true,
    });

    /*
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
        runOnJS(setBarcodes)(detectedBarcodes);
    }, []);
    */
    React.useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
        })();
    }, []);

    React.useEffect(() => {
        if (barcodes.length > 0 && !captured) {
            if (barcodes[0].displayValue !== undefined) {
                console.log(barcodes[0].displayValue);
                setCaptured(true);
                let uri: string = barcodes[0].displayValue;
                if (uri.endsWith('get')) {
                    fetch(uri).then((res) => {
                        res.text().then((value) => Clipboard.setString(value));
                    })
                } else if (uri.endsWith('post')) {
                    Clipboard.getString().then((value) => {
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: `content=${encodeURIComponent(value)}`
                        };
                        fetch(uri, requestOptions).then((res) => res.text()).catch((err) => console.log('error: ' + err));
                    })
                }
            }

        }
    }, [barcodes]);

    return (
        captured ?
            <View>
                <Button title='Read QRCode' onPress={() => { setCaptured(false) }} />
            </View>
            :
            device != null &&
                hasPermission ?
                <>
                    <Camera
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={true}
                        frameProcessor={frameProcessor}
                        frameProcessorFps={5}

                    />
                    {
                        barcodes.map((barcode, idx) => (
                            <Text key={idx} style={styles.barcodeTextURL}>
                                {barcode.displayValue}
                            </Text>
                        ))}
                </>
                :
                <View>
                    <Text style={{ color: 'white' }}>Not permited!</Text>
                </View>
    );
}

const styles = StyleSheet.create({
    barcodeTextURL: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
});