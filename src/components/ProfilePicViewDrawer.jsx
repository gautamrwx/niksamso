import { Box, Button, CircularProgress, Container, Drawer, LinearProgress, Typography } from "@mui/material";
import userLogo from '../images/userLogo.png';
import { CameraAlt, Close, Collections } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref as storageRef, uploadString } from "firebase/storage";
import resizeImage from 'resize-image'
import { useEffect, useState } from "react";

export default function ProfilePicViewDrawer({
    anchor,
    isProfilePicDrawerOpen,
    handleProfilePicDrawerClose,
    imageUploadLocation,
    profilePicDrawerData,
    handleUploaedImageUrl
}) {

    const { fullName, profilePicFull } = profilePicDrawerData;

    const [isLoadingPic, setIsLoadingPic] = useState(false);
    const [currentProfilePic, setCurrentProfilePic] = useState(null);
    const [isImageUploading, setIsImageUploading] = useState(false);

    useEffect(() => {
        setIsLoadingPic(isProfilePicDrawerOpen)
    }, [isProfilePicDrawerOpen]);

    useEffect(() => {
        setCurrentProfilePic(profilePicFull)
    }, [profilePicFull]);

    /**
     * === Profile Pic File Processing And Uploading ===
     */
    const executeImageUpload = (base64Image, height, width, storageLocation) => {
        const base64ResizedImage = resizeImage.resize(base64Image, height, width, resizeImage.JPEG);
        const photoStorageRef = storageRef(getStorage(), String(storageLocation));

        return new Promise((resolve, _) => {
            try {
                uploadString(photoStorageRef, base64ResizedImage, 'data_url').then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    }).catch((e) => {
                        resolve(null);
                    });
                });
            } catch (error) {
                resolve(null);
            }
        });
    }

    const performProfilePicUpload = async (base64Image) => {
        setIsImageUploading(true);

        // Upload Full Pic
        const profilePicFull = await executeImageUpload(
            base64Image,
            300,
            300,
            String(imageUploadLocation + "/profilePicFull.jpg")
        );

        // Upload Thumbnail
        const profilePicThumbnail = await executeImageUpload(
            base64Image,
            80,
            80,
            String(imageUploadLocation + "/profilePicThumbnail.jpg")
        );

        handleUploaedImageUrl({ profilePicFull, profilePicThumbnail });
        setCurrentProfilePic(profilePicFull); // Change Image Source of current profile pic.
        setIsImageUploading(false);
    }

    const handleUserProfilePicChange = (event) => {
        const currFile = event.target.files;

        if (currFile.length === 1) {
            const file = currFile[0];
            if (['image/png', 'image/png', 'image/jpeg'].includes(file.type)) {
                const fr = new FileReader();

                fr.onload = function () {
                    const image = new Image();
                    image.onload = () => { performProfilePicUpload(image) }
                    image.src = fr.result;
                };

                fr.readAsDataURL(file);
            }
        } else {
            alert('Invalid File');
        }
    }

    const getCameraImage = () => {
        return new Promise((resolve, _) => {
            window.navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                sourceType: window.Camera.PictureSourceType.CAMERA,
                encodingType: window.Camera.EncodingType.JPG,
                cameraDirection: window.Camera.Direction.BACK,
                correctOrientation: true,
                targetHeight: 500,
                targetWidth: 500,
                destinationType: window.Camera.DestinationType.DATA_URL
            });

            function onSuccess(capturedBase64Image) {
                resolve({
                    successful: true,
                    capturedBase64Image,
                    message: null
                });
            }

            function onFail(message) {
                resolve({
                    successful: false,
                    capturedBase64Image: null,
                    message
                });
            }
        })

    }

    const handleCameraButtonPress = async () => {
        if (!window.navigator.camera) return;

        const { successful, capturedBase64Image, message } = await getCameraImage();

        if (successful) {
            const image = new Image();
            image.onload = () => { performProfilePicUpload(image) }
            image.src = "data:image/jpeg;base64," + capturedBase64Image;
        } else {
            alert(message);
        }
    }

    return (
        <Drawer
            anchor={anchor}
            open={isProfilePicDrawerOpen}
            onClose={null}
        >
            <Container maxWidth="xs">
                <Box
                    minHeight={400}
                    display="flex"
                    justifyContent="center"
                >
                    <Box>

                        <Box
                            onLoad={() => { setIsLoadingPic(false); }}
                            height={300}
                            component="img"
                            src={
                                currentProfilePic && currentProfilePic !== ''
                                    ? currentProfilePic
                                    : userLogo
                            }
                        />
                        {isLoadingPic && <LinearProgress />}
                        <Typography textAlign={'center'}>
                            {fullName}
                        </Typography>

                        <Box mt={2} mb={2} display={'flex'} justifyContent={'center'}>
                            {
                                isImageUploading
                                    ? <CircularProgress />
                                    : <>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            onClick={handleCameraButtonPress}>
                                            <CameraAlt />
                                        </Button>
                                        <Button
                                            sx={{ ml: 2 }}
                                            variant="outlined"
                                            component="label">
                                            <Collections />
                                            <input
                                                onChange={handleUserProfilePicChange}
                                                type="file"
                                                accept=".png, .jpeg, .jpg"
                                                hidden
                                            />
                                        </Button>
                                        <Button
                                            sx={{ ml: 2 }}
                                            variant="outlined"
                                            color="error"
                                            component="label"
                                            onClick={handleProfilePicDrawerClose}>
                                            <Close />
                                        </Button>
                                    </>
                            }
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Drawer>
    );
}