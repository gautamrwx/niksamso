import { Home } from "@mui/icons-material";

const linkPageMappingHelper = (currentPagePath) => {
    const linkPageMapiings = [
        {
            linkPath: "/",
            linkPageName: "Dashboard",
            isLinkActive: false,
            visibleInNavBar: true,
            drawerIcon:Home
        },
        {
            linkPath: "/MyAccount",
            linkPageName: "My Account",
            isLinkActive: false,
            visibleInNavBar: false
        }
    ];

    // Set Current Page As Active Page
    linkPageMapiings.forEach((linkObject) => {
        if (linkObject.linkPath === currentPagePath) {
            linkObject.isLinkActive = true;
        }
    });

    return linkPageMapiings;
}

export default linkPageMappingHelper;