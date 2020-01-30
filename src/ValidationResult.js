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

const SuccessListItem = styled(ListItem)({
    backgroundColor: "rgb(102, 255, 102)",
});
const WarnListItem = styled(ListItem)({
    backgroundColor: "rgb(255, 255, 102)",
});
const ErrorListItem = styled(ListItem)({
    backgroundColor: "rgb(255, 51, 0)",
});

const MyListItem = (props) => {
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
            <MyListItem type={props.result.reachable ? 'success' : 'error'}>
                <ListItemIcon>
                    {props.result.reachable ? <CheckIcon /> : <ErrorIcon />}
                </ListItemIcon>
                <ListItemText primary="reachable" />
            </MyListItem>
            <MyListItem type={props.result.valid ? 'success' : 'error'}>
                <ListItemIcon>
                    {props.result.valid ? <CheckIcon /> : <ErrorIcon />}
                </ListItemIcon>
                <ListItemText primary="valid" />
            </MyListItem>
            {!props.result.isHttps && <MyListItem type={props.result.httpsForward ? 'success' : 'warning'}>
                <ListItemIcon>
                    {props.result.httpsForward ? <CheckIcon /> : <WarningIcon />}
                </ListItemIcon>
                <ListItemText primary="httpsForward" />
            </MyListItem>}
            <MyListItem type={props.result.isHttps ? 'success' : 'warning'}>
                <ListItemIcon>
                    {props.result.isHttps ? <CheckIcon /> : <WarningIcon />}
                </ListItemIcon>
                <ListItemText primary="isHttps" />
            </MyListItem>
            {showCertValid && <MyListItem type={props.result.certValid ? 'success' : 'error'}>
                <ListItemIcon>
                    {props.result.certValid ? <CheckIcon /> : <ErrorIcon />}
                </ListItemIcon>
                <ListItemText primary="certValid" />
            </MyListItem>}
            <MyListItem type={props.result.contentType ? 'success' : 'warning'}>
                <ListItemIcon>
                    {props.result.contentType ? <CheckIcon /> : <WarningIcon />}
                </ListItemIcon>
                <ListItemText primary="contentType" />
            </MyListItem>
            <MyListItem type={props.result.cors ? 'success' : 'warning'}>
                <ListItemIcon>
                    {props.result.cors ? <CheckIcon /> : <WarningIcon />}
                </ListItemIcon>
                <ListItemText primary="cors" />
            </MyListItem>
            {"{"}
            <JsonValidationResult data={props.result.validatedJson} error={props.result.schemaErrors} />
            {"}"}
        </List>
    )
}

ValidationResult.propTypes = {
    result: PropTypes.object.isRequired,
};

export default ValidationResult

/*
            <pre>
                {JSON.stringify(props.result.validatedJson, (key, value) => {
                    console.log("----jkey----", key, "==== value ====", value)
                    return value
                }, 2)}
            </pre>
 */
