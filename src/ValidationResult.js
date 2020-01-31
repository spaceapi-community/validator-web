import React from 'react';
import PropTypes from "prop-types";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import { styled } from "@material-ui/core"
import JsonValidationResult from "./JsonValidationResult"

const listItemStyle = {
    borderRadius: "15px",
    marginTop: "15px",
    marginBottom: "15px",
};

const SuccessListItem = styled(ListItem)({
    ...listItemStyle,
    backgroundColor: "rgb(102, 255, 102)",
});
const WarnListItem = styled(ListItem)({
    ...listItemStyle,
    backgroundColor: "rgb(255, 255, 102)",
});
const ErrorListItem = styled(ListItem)({
    ...listItemStyle,
    backgroundColor: "rgb(255, 51, 0)",
});

const StyledListItem = (props) => {
    switch(props.type) {
        case 'warning':
            return (
                <WarnListItem>
                    {props.children}
                </WarnListItem>
            );
        case 'success':
            return (
                <SuccessListItem>
                    {props.children}
                </SuccessListItem>
            );
        case 'error':
        default:
            return (
                <ErrorListItem>
                    {props.children}
                </ErrorListItem>
            )
    }
};

function ValidationResult(props) {
    const showCertValid = props.result.isHttps || props.result.httpsForward

    return (
        <List>
            {!props.result.reachable &&
                <StyledListItem type={'error'}>
                    <ListItemIcon>
                        <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={"The provided URL is not reachable"}
                        secondary={"Check your server something is wrong."}
                    />
                </StyledListItem>
            }
            {props.result.valid &&
                <StyledListItem type={'success'}>
                    <ListItemIcon>
                        <CheckIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Checked JSON is valid!"
                        secondary={"The checked JSON is valid against the SpaceAPI schema."}
                    />
                </StyledListItem>
            }
            {!props.result.valid &&
                <StyledListItem type={'error'}>
                    <ListItemIcon>
                        <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Checked JSON is invalid!"
                        secondary={"The checked JSON is not valid against the SpaceAPI schema, check the details below."}
                    />
                </StyledListItem>
            }
            {!props.result.isHttps &&
            !props.result.httpsForward &&
                <StyledListItem type={'warning'}>
                    <ListItemIcon>
                        <WarningIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Your server is not forwarding HTTP calls to HTTPS"
                        secondary={"Using your SpaceAPI file on a website that is using HTTPS is not possible, see [mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) for more information."}
                    />
                </StyledListItem>
            }
            {!props.result.isHttps &&
                <StyledListItem type={'warning'}>
                    <ListItemIcon>
                        {props.result.isHttps ? <CheckIcon /> : <WarningIcon />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Your server is not reachable via HTTPS"
                        secondary={"Using your SpaceAPI file on a website that is using HTTPS is not possible, see [mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) for more information."}
                    />
                </StyledListItem>
            }
            {!props.result.certValid &&
            showCertValid &&
                <StyledListItem type={'error'}>
                    <ListItemIcon>
                        <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText primary="certValid" />
                </StyledListItem>
            }
            {props.result.contentType &&
                <StyledListItem type={'warning'}>
                    <ListItemIcon>
                        <WarningIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Content-Type header missing"
                        secondary={"The server is not providing the correct [Content-Type header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)"}
                    />
                </StyledListItem>
            }
            {!props.result.cors &&
                <StyledListItem type={'warning'}>
                    <ListItemIcon>
                        <WarningIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={"CORS header not set"}
                        secondary={"Your server is not providing CORS header, this stops other websites from using your file, you can find more information about it [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)."}
                    />
                </StyledListItem>
            }
            <JsonValidationResult data={props.result.validatedJson} error={props.result.schemaErrors} />
        </List>
    )
}

ValidationResult.propTypes = {
    result: PropTypes.object.isRequired,
};

export default ValidationResult
