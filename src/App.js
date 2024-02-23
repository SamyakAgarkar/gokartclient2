import './App.css';
import { useEffect, useState } from "react";
import mqtt from 'mqtt'
import { Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Button, Col, Form, Row } from 'react-bootstrap';

function App() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [cam, setCam] = useState(null);
  const [isCam, setIsCam] = useState(null);
  const [isFinger, setIsFinger] = useState(null);
  const [BPM, setBPM] = useState(null);
  const [RotX, setRotX] = useState(null);
  const [RotY, setRotY] = useState(null);
  const [RotZ, setRotZ] = useState(null);
  const [AccX, setAccX] = useState(null);
  const [AccY, setAccY] = useState(null);
  const [AccZ, setAccZ] = useState(null);
  const [light, setLight] = useState(null);

  const [flash, setflash] = useState(false)
  const [headlight, setheadlight] = useState(false)
  const [buzzer, setbuzzer] = useState(false)
  const [extra1, setextra1] = useState(false)
  const [extra2, setextra2] = useState(false)
  const [emergency, setemergency] = useState(false)
  const [emergencySwitch, setemergencySwitch] = useState(false)
  const [rfid, setrfid] = useState(null)
  const [cameraiframe, setcameraiframe] = useState(null)

  const [Client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const MQTT_SERVER = 'ws://13.233.237.130:9001'; // Update with your MQTT broker URL
  const MQTT_TOPIC = 'your/topic'; // Update with your topic

  useEffect(() => {
    const client = mqtt.connect(MQTT_SERVER);
    setClient(client);

    client.on('connect', () => {
      setIsConnected(true);
      client.publish('getgps', '1')

      console.log('Connected to MQTT Broker!');
    });

    client.on('message', (topic, message) => {
      // Handle incoming messages
      console.log(`Received message: ${message.toString()} from topic: ${topic}`);
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  const subscribeToTopic = () => {
    if (Client) {
      Client.subscribe(MQTT_TOPIC, (error) => {
        if (error) {
          console.log('Subscribe to topic failed', error);
          return;
        }
        console.log(`Subscribed to ${MQTT_TOPIC}`);
      });
    }
  };

  const publish = (topic, message) => {
    if (Client) {
      Client.publish(topic, 'Hello MQTT', (error) => {
        if (error) {
          console.log('Publish failed', error);
        }
      });
    }
  };



  const onSwitchFlash = () => {
    if (flash) {
      setflash(false)
      publish('setFlash', '1')
    } else {
      setflash(true)
      publish('setFlash', '0')
    }
  }

  const onSwitchHeadlight = () => {
    if (headlight) {
      setheadlight(false)
      publish('setHeadlight', '0')
    } else {
      setheadlight(true)
      publish('setHeadlight', '1')
    }
  }

  const onSwitchBuzzer = () => {
    if (buzzer) {
      setbuzzer(false)
      publish('setBuzzer', '0')
    } else {
      setbuzzer(true)
      publish('setBuzzer', '1')
    }
  }
  const onSwitchIsCam = () => {
    if (isCam) {
      setIsCam(false)

    } else {
      setIsCam(true)

    }
  }

  const onSwitchExtra1 = () => {
    if (extra1) {
      setextra1(false)
      publish('setExtra1', '0')
    } else {
      setextra1(true)
      publish('setExtra1', '1')
    }
  }

  const onSwitchExtra2 = () => {
    if (extra2) {
      setextra2(false)
      publish('setExtra2', '0')
    } else {
      setextra2(true)
      publish('setExtra2', '1')
    }
  }

  const onSwitchEmergency = () => {
    if (emergency) {
      setemergency(false)
    } else {
      console.log('emergency')
      setemergency(true)
    }
  }
  const emergencyCallHandler = () => {
    if (emergencySwitch) {
      publish('setBuzzer', '1')
      setemergencySwitch(false)
    } else {
      publish('setBuzzer', '0')
      setemergencySwitch(true)
    }
  }

  useEffect(() => {
    setInterval(() => {
      console.log('emergency switching: ', emergency)

      if (emergency) {
        emergencyCallHandler()
        console.log('emergency switching1')
      }
    }, 3000)
  }, [emergency, emergencySwitch])

  useEffect(() => {
    if (RotX > 90 || RotX < -90 || RotY > 90 || RotY < -90) {
      setemergency(true);
    }
    console.log(`https://www.openstreetmap.org/export/embed.html?bbox=${(parseFloat(lng) - 0.02).toString()}%2C${(parseFloat(lat) - 0.02).toString()}%2C${(parseFloat(lng) + 0.02).toString()}%2C${(parseFloat(lat) + 0.02).toString()}&marker=${lat}%2C${lng}&layers=ND`)
  }, [RotX, RotY])

  useEffect(() => {
    if (parseInt(light) > 2500) {
      onSwitchHeadlight();
    }
  }, [light])

  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  }



  // useEffect(() => {

  //   const PubSub = mqtt.connect('ws://13.233.237.130:9001')

  //   PubSub.on('connect', function () {
  //     PubSub.subscribe('getgps', function (err) {
  //       if (!err) {
  //         console.log('Subscribed to getgps')
  //       }
  //     })
  //     PubSub.subscribe('getrfid', function (err) {
  //       if (!err) {
  //         console.log('Subscribed to getrfid')
  //       }
  //     })
  //     PubSub.subscribe('getall2', function (err) {
  //       if (!err) {
  //         console.log('Subscribed to getall2')
  //       }
  //     })
  //   });

  //   PubSub.on('message', function (topic, message) {
  //     console.log('Message received', message.toString())
  //     const data = JSON.parse(message.toString())
  //     if (topic === 'getgps') {
  //       console.log('Message received', data.value);
  //       setLat(data.value.lat);
  //       setLng(data.value.lng);
  //       setCam(data.value.cam);
  //       console.log(`http://${data.value.cam}`);
  //       if (!cam) {
  //         setcameraiframe(`http://${data.value.cam}:80`)
  //       }
  //       console.log("HAHAHAHAH");
  //     }
  //     else if (topic === 'getrfid') {
  //       console.log('Message received', data.value);
  //       setrfid(data.value.rfid);
  //     }
  //     else if (topic === 'getall2') {
  //       console.log('Message received', data.value);
  //       setIsFinger(data.value.isFinger)
  //       setBPM(data.value.BPM)
  //       setRotX(data.value.RotX)
  //       setRotY(data.value.RotY)
  //       setRotZ(data.value.RotZ)
  //       setAccX(data.value.AccX)
  //       setAccY(data.value.AccY)
  //       setAccZ(data.value.AccZ)
  //       setLight(data.value.Light)
  //     }
  //   })



  //   // PubSub.subscribe('getgps', (err) => {
  //   //   if (!err) {
  //   //     console.log('Message received', data.value);
  //   //     setLat(data.value.lat);
  //   //     setLng(data.value.lng);
  //   //     setCam(data.value.cam);
  //   //     console.log(`http://${data.value.cam}`);
  //   //     if (!cam) {
  //   //       setcameraiframe(`http://${data.value.cam}:80`)
  //   //     }
  //   //     console.log("HAHAHAHAH");
  //   //   }

  //   // });

  //   // PubSub.subscribe('getrfid', err => {
  //   //   if (!err) {
  //   //     console.log('Message received', data.value);
  //   //     setrfid(data.value.rfid);
  //   //   }
  //   // });
  //   // PubSub.subscribe('getall2', err => {
  //   //   if (!err) {
  //   //     console.log('Message received', data.value);
  //   //     setIsFinger(data.value.isFinger)
  //   //     setBPM(data.value.BPM)
  //   //     setRotX(data.value.RotX)
  //   //     setRotY(data.value.RotY)
  //   //     setRotZ(data.value.RotZ)
  //   //     setAccX(data.value.AccX)
  //   //     setAccY(data.value.AccY)
  //   //     setAccZ(data.value.AccZ)
  //   //     setLight(data.value.Light)
  //   //     // "isFinger": "NO",
  //   //     // "BPM": "0",
  //   //     // "RotX": "172.62",
  //   //     // "RotY": "60.96",
  //   //     // "RotZ": "315.68",
  //   //     // "Light": "3735"
  //   //   }
  //   // })


  // }, [])

  // const publish = (topic, message) => {

  //   // connected && PubSub.publish(topic, message)
  // }

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <Container maxWidth={'lg'} >

        <br />
        <div className='text-center' style={{ width: '100%' }}> <img className='img-fluid text-center' width={'50%'} src='./logo512.png' /></div>
        <h1 style={{ paddingTop: '3rem', paddingBottom: '3rem', textAlign: 'center', paddingTop: '1rem' }}>
          Mecheetah 1.0</h1>


        <Form style={{ fontSize: '1.3rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
          <Row>
            <Form.Check
              type="switch"
              id="flash"
              label="Flash"
              checked={flash}
              onChange={onSwitchFlash}
              style={{ width: '50%' }}
            />

            <Form.Check
              type="switch"
              id="headlight"
              label="Headlight"
              checked={headlight}
              onChange={onSwitchHeadlight}
              style={{ width: '50%' }}

            />
            <Form.Check
              type="switch"
              id="buzzer"
              label="Buzzer"
              checked={buzzer}
              onChange={onSwitchBuzzer}
              style={{ width: '50%' }}

            />
            <Form.Check
              type="switch"
              id="extra1"
              label="Start"
              checked={extra1}
              onChange={onSwitchExtra1}
              style={{ width: '50%' }}

            />
            <Form.Check
              type="switch"
              id="extra2"
              label="Stop"
              checked={extra2}
              onChange={onSwitchExtra2}
              style={{ width: '50%' }}

            />
            <Form.Check
              type="switch"
              id="emergency"
              label="Emergency"
              checked={emergency}
              onChange={onSwitchEmergency}
              style={{ width: '50%' }}
            />

            {/* <Form.Check 
            type="switch"
            id="sam"
            label="Camera"
            checked={isCam}
            onChange={onSwitchIsCam}
            style={{width:'50%'}}
          /> */}
          </Row>

          <a style={{ backgroundColor: 'white', textAlign: 'center', textDecoration: 'none', padding: '0.5rem 0.5rem', fontWeight: 'bold' }} href={`${cameraiframe}`} target='_blank'>Show Cam</a>

        </Form>



        <br />
        <br />
        {emergencySwitch && <h2 style={{ color: 'red', textAlign: 'center' }}>Emergency!!!!</h2>}

        {/* {cam && isCam && <div>{cameraiframe}</div>} */}

        {lat &&
          <iframe width={"600px"}
            height={"400px"}
            title='map'
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(parseFloat(lng) - 0.02).toString()}%2C${(parseFloat(lat) - 0.02).toString()}%2C${(parseFloat(lng) + 0.02).toString()}%2C${(parseFloat(lat) + 0.02).toString()}&marker=${lat}%2C${lng}&layers=ND`}
            style={{ border: '1px solid black' }} />
        }

        <p>Latitude: </p>{lat && <p>{lat}</p>}
        <p>Longitude: </p>{lng && <p>{lng}</p>}
        <p>Cam IP: </p>{cam && <p>{cam}</p>}
        <p> Finger on Steering?: </p>{isFinger && <p>{isFinger}</p>}
        <p>BPM: </p>{BPM && <p>{BPM}</p>}
        <p>Rotation in X Axis: </p>{RotX && <p>{RotX}</p>}
        <p>Rotation in Y Axis: </p>{RotY && <p>{RotY}</p>}
        <p>Rotation in Z Axis: </p>{RotZ && <p>{RotZ}</p>}
        <p>Accelaration in X Axis: </p>{AccX && <p>{AccX}</p>}
        <p>Accelaration in Y Axis: </p>{AccY && <p>{AccY}</p>}
        <p>Accelaration in Z Axis: </p>{AccZ && <p>{AccZ}</p>}
        <p>Light Value: </p>{light && <p>{light}</p>}
        <p>RFID: </p>{rfid && <p>{rfid}</p>}
        <p>RFID: </p>{rfid && (rfid == 1 ? <p>Driver In</p> : <p>Driver Out</p>)}


      </Container >

      <Dialog open={open} slotProps={{ backdrop: { style: { backgroundColor: ' rgb(11, 3, 23)' } } }}>
        <DialogTitle sx={{ textAlign: 'center' }}>Login</DialogTitle>
        <DialogContent>
          <Form style={{ padding: '1rem' }}>
            <TextField label="Username" sx={{marginY:1}} fullWidth placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Password" sx={{marginY:1}} fullWidth placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form>

        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => {
            if (username === 'manishparate' && password === 'manishparate') {
              handleClose()
            }
          }} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
