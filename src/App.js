import './App.css';

import { Peer } from "peerjs";
import firebase from "firebase/app";
// import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import { useEffect, useState, useRef } from 'react';

function App() {
    useEffect(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyBVYwyg8ejvhSE_oBtgWOdJpjF98-IVUTc",
            authDomain: "callapp-9b05f.firebaseapp.com",
            projectId: "callapp-9b05f",
            storageBucket: "callapp-9b05f.appspot.com",
            messagingSenderId: "797910347327",
            appId: "1:797910347327:web:c017b5082719e6ea57d28a",
            measurementId: "G-MF5MJ3LHHD"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("ket noi thanh cong")
        }
    }, []);
    const [videoA, setVideoA] = useState(null);
    const [videoB, setVideoB] = useState(null);
    const [id, setId] = useState(null);

            // khởi tạo peer 
        // sau nay gắn id của user muốn gọi vào đây 
        const peer = new Peer();
        peer.on('open', id => {
            console.log(id)
            document.getElementById("my-peer").innerHTML = id;
        })
    function openStream() {
        const constraints = {
            audio: true,
            video: true,
        }
        return navigator.mediaDevices.getUserMedia(constraints); // cái này trả về một promise
        // navigator.mediaDevices. lấy thông tin về các thiết bị đa phương tiện 
        // navigator.mediaDevices.getUserMedia() // yêu cầu quyền truy cập và các phương tiện
    }
    // lúc mình gọi họ
    function callVideo() {
        var id  = document.getElementById("enterId").value ;
        openStream() // cấu hình , yêu cầu quyền phương tiện 
            .then(stream => {
                setVideoA({ stream });
                document.getElementById("localVideo").srcObject = stream; // video của mình 
                const call = peer.call(id, stream); // id của đối phương
                call.on("stream", (remoteStream) => {                      // nhận video họ
                    document.getElementById("remoteVideo").srcObject = remoteStream; // xem video của họ 
                });
            })
            .catch(error => {
                console.error(error);
            })
    }
    // lúc họ gọi mình 
    peer.on("call", (call) => {
        openStream()
            .then(stream => { // 
                call.answer(stream);
                document.getElementById("localVideo").srcObject = stream; // video của mình 
                call.on("stream", (remoteStream) => {
                    document.getElementById("remoteVideo").srcObject = remoteStream; // xem video của họ 
                })
                // setVideoB({ stream });
            })
    })
    return (
        <div className="App">
            <p>id :</p>
            <p id="my-peer"></p>
            <p>chao moi nguoi</p>
            <video className="banner-video" id="localVideo" src={videoA || null} controls autoPlay></video>
            <video className="banner-video" id="remoteVideo" src={videoB || null} controls autoPlay></video>
            <input type="text" id="enterId"/>
            <button type="button" className="" onClick={() => callVideo()}>goi</button>
        </div>
    );
}

export default App;
