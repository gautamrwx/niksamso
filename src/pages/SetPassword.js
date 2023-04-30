import React from 'react';
import { Input, InputGroup, Whisper, Tooltip } from 'rsuite';
import AvatarIcon from '@rsuite/icons/legacy/Avatar';

function SetPassword() {   
    const onSetPassBtnPress = () => {
        // check input

        // check Exist Email from Backend

        // Create User And Village Collection
    };

    return (
        <div>
            <h1>Password Setup</h1>
            <InputGroup inside>
                <InputGroup.Addon>
                    <AvatarIcon />
                </InputGroup.Addon>
                <Input />
            </InputGroup>
        </div>
    );
}

export default SetPassword;
