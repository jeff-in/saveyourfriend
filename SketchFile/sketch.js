
// global variables
var c;
var pubnub;
var uniqueid;
var userCount=1;
var avatar;
var userState=0;
var recState;
var stateTime=0;
var prevTime=0;
var serial;
var ardVal ;
var name;
var name2;
var gotName=0;
var ping=0;
function preload()
{
chair = loadImage("Chair.png");
avatar= [loadImage("chairdesk.png"),loadImage("Back3.jpg"),loadImage("Back2.png"),loadImage("Back1.png"),loadImage("chairdesk.png")];

}

function setup()
{
  createCanvas(windowWidth, windowHeight);
  c = color(random(255), random(255), random(255));
  uniqueid = PUBNUB.uuid();
  pubnub = PUBNUB.init(
  {
    publish_key   : 'pub-c-5488c8d9-f1b2-44fc-9ca6-2618483527f8',
    subscribe_key : 'sub-c-cc077442-a501-11e6-9fcd-0619f8945a4f',
    uuid: uniqueid
  });

  pubnub.subscribe(
  {
    channel : "drawing",
    message: handleMessage
  });
  serial = new p5.SerialPort();     //create the serial port object
  serial.open("COM10"); //open the serialport. determined
  serial.on('open',ardCon);         //open the socket connection and execute the ardCon callback
  serial.on('data',dataReceived);   //when data is received execute the dataReceived function
}

function draw()

{  scale(0.2,0.185);

    checkValue();
    image(avatar[userState],800,500);
    stateTime=millis()-prevTime;
    stateTime=floor(stateTime/1000);
    noStroke();
    if(stateTime<255)fill(stateTime,255-stateTime,0);
    else fill(255,0,0);
    ellipse(3000,560,150,150);
  //  console.log(floor(stateTime/1000));
  console.log(name2);
}

function handleMessage(message)
{

  if(message.uniqueid != uniqueid)
  {
    image(avatar[message.state],windowWidth/2+3000,500);
    if(message.runTime<255)fill(message.runTime,255-message.runTime,0);
    else fill(255,0,0);
    ellipse(5200,560,150,150);
  }
if(message.state!=recState)
{ prevTime=millis();
  stateTime=0;
  recState=message.state;
}if(message.userClick==1)sound.play();
}
function checkValue()
{if(ardVal>=0&&ardVal<=3)
  userState=ardVal;
  pubnub.publish(
  {
    channel: 'drawing',
    message: {
      state: userState,
      uniqueid: uniqueid,
      userClick:ping,
      runTime:stateTime
    }
  });ping=0;

}

function dataReceived()   //this function is called every time data is received
{
  ardVal = serial.readLine();
  console.log(ardVal);

}

function ardCon()
{
  console.log("connected to the arduino");
}
function mouseClicked()
{
  ping=1;
}
