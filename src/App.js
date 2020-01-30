import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { ValidateUrlV2, V2Api } from '@spaceapi/validator-client';
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

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  //https://status.chaospott.de/status.json
  //https://spaceapi.attraktor.org/spaceapi.json
  //https://status.ctdo.de/api/spaceapi/v13
  const [urlValue, setUrlValue] = React.useState('https://spaceapi.attraktor.org/spaceapi.json');
  const [urlError, setUrlError] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState('');

  const handleTextInputChange = event => {
    setUrlValue(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
                  onChange={handleTextInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={(event) => {
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

                  }}
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
          />
          <Button
              variant="contained"
              color="primary"
              fullWidth
          >
            Validate
          </Button>
        </TabPanel>
        <Box>
          {validationResult && <ValidationResult result={validationResult}/>}
        </Box>

      </Container>
    </div>
  );
}

export default App;
