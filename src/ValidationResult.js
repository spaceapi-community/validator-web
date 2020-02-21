import React from 'react';
import PropTypes from "prop-types";
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
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
    const showCertValid = props.result.isHttps === true
        || props.result.httpsForward === true

    return (
        <List>
            {props.result.reachable === false &&
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
            {props.result.valid === true &&
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
            {props.result.valid === false &&
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
            {props.result.isHttps === false &&
            props.result.httpsForward === false &&
                <StyledListItem type={'warning'}>
                    <ListItemIcon>
                        <WarningIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Your server is not forwarding HTTP calls to HTTPS"
                        secondary={<div>Using your SpaceAPI file on a website that is using HTTPS is not possible, see <Link href={"https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content"}>mixed content</Link> for more information.</div>}
                    />
                </StyledListItem>
            }
            {props.result.isHttps === false &&
                <StyledListItem type={'warning'}>
                    <ListItemIcon>
                        {props.result.isHttps ? <CheckIcon /> : <WarningIcon />}
                    </ListItemIcon>
                    <ListItemText
                        primary="The URL is not HTTPS"
                        secondary={<div>Using your SpaceAPI file on a website that is using HTTPS is not possible, see <Link href={"https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content"}>mixed content</Link> for more information.</div>}
                    />
                </StyledListItem>
            }
            {props.result.certValid === false &&
            showCertValid &&
                <StyledListItem type={'error'}>
                    <ListItemIcon>
                        <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText primary="certValid" />
                </StyledListItem>
            }
            {props.result.contentType === false &&
                <StyledListItem type={'warning'}>
                    <ListItemIcon>
                        <WarningIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Content-Type header missing"
                        secondary={<div>The server is not providing the correct <Link href={"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type"}>Content-Type header</Link></div>}
                    />
                </StyledListItem>
            }
            {props.result.cors === false &&
                <StyledListItem type={'warning'}>
                    <ListItemIcon>
                        <WarningIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={"CORS header not set"}
                        secondary={<div>Your server is not providing CORS header, this stops other websites from using your file, you can find more information about it <Link href={"https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"}>here</Link>.</div>}
                    />
                </StyledListItem>
            }
            {props.result.validatedJson && <JsonValidationResult data={props.result.validatedJson} error={props.result.schemaErrors} />}
        </List>
    )
}

ValidationResult.propTypes = {
    result: PropTypes.object.isRequired,
};

export default ValidationResult
