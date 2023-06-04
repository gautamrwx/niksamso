import { Box, Button, Container, Drawer, LinearProgress, Typography } from "@mui/material";
import userLogo from '../../../images/userLogo.png';
import { Upload } from "@mui/icons-material";
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

    const [isLoadingPic, setIsLoadingPic] = useState(false);

    useEffect(() => {
        setIsLoadingPic(isProfilePicDrawerOpen)
    }, [isProfilePicDrawerOpen])

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

    return (
        <Drawer
            anchor={anchor}
            open={isProfilePicDrawerOpen}
            onClose={handleProfilePicDrawerClose}
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
                                profilePicDrawerData.profilePicFull && profilePicDrawerData.profilePicFull !== ''
                                    ? profilePicDrawerData.profilePicFull
                                    : userLogo
                            }
                        />
                        {isLoadingPic && <LinearProgress />}
                        <Typography textAlign={'center'}>
                            {profilePicDrawerData.name}
                        </Typography>

                        <Box mt={2} mb={2} display={'flex'} justifyContent={'center'}>
                            <Button>Capture</Button>
                            <Button
                                variant="outlined"
                                component="label">
                                <Typography>Upload</Typography> <Upload />
                                <input
                                    onChange={handleUserProfilePicChange}
                                    type="file"
                                    accept=".png, .jpeg, .jpg"
                                    hidden
                                />
                            </Button>
                            <Button
                                onClick={handleProfilePicDrawerClose}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Drawer>
    );
}