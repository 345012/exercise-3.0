// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let timer = 0;
let poseNet;
let poses = [];
let handx;
let handy;
let nosex;
let nosey;
let flag = "false";
let swapCount = 0;
let emoji = ["😄", "😝", "😎", "🤩", "🥳"];
let positionCount = 0;
let position = [];
position[0] = [];
position[1] = [];
let background;

function preload(){
  background = loadImage("image.jpg")  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  textSize(30);

  video.size(width * 0.6, height * 0.7);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  image (background,0,0,width,height)
  translate(width * 0.2, height * 0.25);
  image(video, 0, 0, width * 0.6, height * 0.7);

  push();
  drawKeypoints();
  pop();
  // We can call both functions to draw all keypoints and the skeletons
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  handx = 0;
  handy = 0;
  nosex = 0;
  nosey = 0;
  if (position[0][0] != 0 && position[1][0] != 0) {
    for (let i = 0; i < position[0].length; i++) {
      text(emoji[swapCount % 5], position[0][i], position[1][i]);
    }
  }

  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;

    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];

      if (
        (keypoint.part === "rightWrist" || keypoint.part === "leftWrist") &&
        keypoint.score > 0.6
      ) {
        handx = keypoint.position.x;
        handy = keypoint.position.y;
        text(emoji[swapCount % 5], handx, handy);
        if (frameCount % 3 == 0) {
          position[0][positionCount] = handx;
          position[1][positionCount] = handy;
          positionCount++;
        }
      }

      if (keypoint.part === "nose" && keypoint.score > 0.6) {
        nosex = keypoint.position.x;
        nosey = keypoint.position.y;
        text(emoji[swapCount % 5], nosex, nosey);
        if (frameCount % 6 == 0) {
          position[0][positionCount] = nosex;
          position[1][positionCount] = nosey;
          positionCount++;
        }
      }
      if (
        handx != 0 &&
        handy != 0 &&
        dist(handx, handy, nosex, nosey) < 120 &&
        flag == "false" &&
        frameCount - timer > 90
      ) {
        flag = "true";
        swapCount++;
        position[0] = [];
        position[1] = [];
        positionCount = 0;
        timer = frameCount;
      } else {
        flag = "false";
      }
      console.log(timer);
    }
  }
}
