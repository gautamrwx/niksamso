import { Box, Typography } from '@mui/material';
import logo from '../../../images/logo-no-text.png'

const HeaderLogoAndText = ({ currentPageName, isDashBoardAppBar }) => {
    return (
        <>
            <Box
                width={30}
                component="img"
                src={logo} />

            <Typography
                display={{ xs: 'none', md: 'block' }}
                fontSize={25}
                ml={2}>
                Nikasamso
            </Typography>

            {isDashBoardAppBar
                ? <Typography
                    display={{ xs: 'none', sm: 'block' }}
                    ml={1}
                    fontSize={15}>
                    / {currentPageName}
                </Typography>
                : <Typography
                    ml={1}
                    fontSize={15}>
                    / {currentPageName}
                </Typography>}
        </>
    )
}

export default HeaderLogoAndText