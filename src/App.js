import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ValidateUrlV2, V2Api } from '@spaceapi/validator-client';
import { ThemeProvider } from '@material-ui/core/styles';
import ValidationResult from './ValidationResult'
import './App.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <Box
          component="div"
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
        {value === index && children}
      </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    padding: 15,
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333333',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

function App(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [urlValue, setUrlValue] = React.useState(props.checkUrl ? props.checkUrl : '');
  const [jsonValue, setJsonValue] = React.useState('');
  const [urlError, setUrlError] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState('');

  const handleUrlTextInputChange = event => {
    setUrlValue(event.target.value);
  };

  const handleJsonTextInputChange = event => {
    setJsonValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const validateUrl = () => {
    if (urlValue !== "") {
      const api = new V2Api();
      const validateUrlV2 = new ValidateUrlV2(urlValue);
      api.v2ValidateURLPost(validateUrlV2).then(res => {
        setValidationResult(res)
        setUrlError(false)
      })
    } else {
      setUrlError(true)
    }
  };

  const validateJson = () => {
    const api = new V2Api();
    api.v2ValidateJSONPost(jsonValue).then(res => {
      setValidationResult(res)
    })
  };

  useEffect(props.checkUrl ? validateUrl : () => {}, [])

  return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Validate URL" {...a11yProps(0)} />
              <Tab label="Validate Direct Input" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <Container classes={{
            root: classes.container,
          }}>
            <TabPanel value={value} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={10}>
                  <TextField
                      error={urlError}
                      variant="outlined"
                      fullWidth
                      label="URL"
                      value={urlValue}
                      onChange={handleUrlTextInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={validateUrl}
                  >
                    Validate
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TextField
                  variant="outlined"
                  rowsMax="20"
                  rows="20"
                  multiline
                  fullWidth
                  label="JSON"
                  onChange={handleJsonTextInputChange}
              />
              <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={validateJson}
              >
                Validate
              </Button>
            </TabPanel>
            <Box>
              {validationResult && <ValidationResult result={validationResult}/>}
            </Box>

          </Container>
        </div>
      </ThemeProvider>
  );
}

App.propTypes = {
  checkUrl: PropTypes.string,
};

App.defaultProps = {
  checkUrl: ""
};

export default App;
