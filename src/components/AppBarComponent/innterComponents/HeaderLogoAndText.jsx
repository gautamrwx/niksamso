import { Box, Typography } from '@mui/material';
import logo from '../../../images/logo-no-text.png'

const HeaderLogoAndText = ({
    currentPageName,
    isRightSideComponentOccupied
}) => {
    return (
        <>
            <Box
                width={30}
                component="img"
                src={logo}
            />

            <Box display={{ xs: 'none', md: 'flex' }} ml={2} flexDirection={'column'} alignItems='center'>
                <Typography fontSize={22} lineHeight='1'>
                    Nikasamso
                </Typography>
            </Box>

            <Box ml={1.5} alignItems={'center'} display={{ xs: isRightSideComponentOccupied ? 'none' : 'inline-flex', sm: 'inline-flex' }}>
                <Typography fontSize={25}>|</Typography>
                <Typography
                    color='#e0e9ea'
                    ml={1.5}
                    mt={0.4}
                    fontSize={15}>
                    {currentPageName}
                </Typography>

            </Box>


        </>
    )
}

export default HeaderLogoAndText