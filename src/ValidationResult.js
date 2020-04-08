import React from 'react';
import PropTypes from "prop-types";
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import { styled } from "@material-ui/core"
import JsonValidationResult from "./JsonValidationResult";

const listItemStyle = {
    borderRadius: "15px",
    marginTop: "15px",
    marginBottom: "15px",
};

const SuccessListItem = styled(ListItem)({
    ...listItemStyle,
    backgroundColor: "rgb(100, 255, 100)",
})
const InfoListItem = styled(ListItem)({
    ...listItemStyle,
    backgroundColor: "rgb(170,170,255)",
});
const WarnListItem = styled(ListItem)({
    ...listItemStyle,
    backgroundColor: "rgb(255,255,100)",
});
const ErrorListItem = styled(ListItem)({
    ...listItemStyle,
    backgroundColor: "rgb(255,100,100)",
});

const StyledListItem = (props) => {
    switch(props.type) {
        case 'warning':
            return (
                <WarnListItem>
                    {props.children}
                </WarnListItem>
            );
        case 'info':
            return (
                <InfoListItem>
                    {props.children}
                </InfoListItem>
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
    console.log(props.address)

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
            {props.address !== undefined &&
            <StyledListItem type={'info'}>
                <ListItemIcon>
                    <InfoIcon />
                </ListItemIcon>
                <ListItemText
                    primary={"We found an address to the provided geo coordinates!"}
                    secondary={"It seems to be in " + props.address.country + ". Looking good."}
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
            {props.address === undefined &&
            <StyledListItem type={'warning'}>
                <ListItemIcon>
                    <WarningIcon />
                </ListItemIcon>
                <ListItemText
                    primary={"Geo coordinates doesn't seem to have an address"}
                    secondary={"Maybe longitude and latitude are switched?"}
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
    address: PropTypes.object,
};

export default ValidationResult
