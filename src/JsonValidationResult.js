import React from 'react';
import PropTypes from "prop-types";

const getVal = (val, props, key) => {
    if (val === null) {
        return "null"
    } else if(typeof val !== "object") {
        return `${getSpan(val)}${val.toString()}${getSpan(val, false)}`
    } else {
        return (
            <span>
                {getSpan(val)}
                <JsonValidationResult
                    data={val}
                    error={props.error}
                    path={[ ...props.path, key]}
                    indention={props.indention + 2}
                />
                {" ".repeat(props.indention)}{getSpan(val, false)}
            </span>
        )
    }
};

const getSpan = (val, start = true) => {
    switch (typeof val) {
        case "string":
            return "\"";
        case "object":
            if (Array.isArray(val)) {
                return start ? "[" : "]";
            }
            return start ? "{" : "}";
        default:
            return "";
    }
};

function JsonValidationResult(props) {
    return (
        <div>
            {props.path.length === 1 ? "{" : ""}
            {Object.entries(props.data).map((entry) => {
                const key = entry[0];
                const val = entry[1];

                const pathString = `${props.path.join(".")}.${key}`;
                const errorMessages = props.error ? props.error
                    .filter((val) => val.field === pathString)
                    .map((val) => val.message) : [];
                const isError = errorMessages.length !== 0;

                return (
                    <div
                        style={{ backgroundColor: isError ? "rgb(255, 51, 0)" : "transparent"}}
                        title={errorMessages.join(", ")}
                    >
                        <pre style={{margin:0}}>
                            {" ".repeat(props.indention)}{isNaN(key) ? `${key}:` : ""} {getVal(val, props, key)}
                        </pre>
                    </div>
                );
            })}
            {props.path.length === 1 ? "}" : ""}
        </div>
    )
}

JsonValidationResult.propTypes = {
    data: PropTypes.any.isRequired,
    error: PropTypes.array.isRequired,
    path: PropTypes.array,
    indention: PropTypes.number,
};

JsonValidationResult.defaultProps = {
    path: ["(root)"],
    indention: 2,
}

export default JsonValidationResult
