# Clipboard Share project for Android and iOS

This is a ReactNative app for share clipboard content between Android and PC with QRCode and HTTP GET and POST requests.

The program required access to camera and internet connection. Android device accept QR code encoded URL from camera and send or receive clipboard content to/from microservices on target PC.

(tested only in Android)

Microservice address should generate with projects:
- https://github.com/pzoli/ClipboardShareService
- https://github.com/pzoli/ClipboardShareMicroservice

## Install

```
git clone https://github.com/pzoli/ClipboardShareApp.git
cd ClipboardShareApp
yarn install
npx react-native start
npx react-native run-android
```
