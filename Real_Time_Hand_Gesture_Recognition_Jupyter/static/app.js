const video=document.getElementById('video'), canvas=document.getElementById('canvas'), ctx=canvas.getContext('2d');
const startBtn=document.getElementById('startBtn'),stopBtn=document.getElementById('stopBtn');
const placeholder=document.getElementById('placeholder'),cameraState=document.getElementById('cameraState'),notice=document.getElementById('notice');
let stream=null,timer=null,busy=false;
const icons={'Open Palm':'🖐️','Closed Fist':'✊','Thumb Up':'👍','Thumb Down':'👎','Victory':'✌️','Pointing Up':'☝️','ILoveYou':'🤟','Love':'🤟'};
startBtn.onclick=async()=>{
 try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:960},height:{ideal:720}},audio:false});
 video.srcObject=stream;video.style.display='block';placeholder.style.display='none';document.querySelector('.tracking-line').style.display='block';
 startBtn.disabled=true;stopBtn.disabled=false;cameraState.textContent='SESSION ACTIVE';document.getElementById('connection').textContent='Connected';notice.textContent='Live recognition active. Try changing gestures while keeping your hand clearly visible.';
 timer=setInterval(sendFrame,600);
 }catch(e){notice.textContent='Camera could not start: '+e.message+'. Allow camera access and use http://127.0.0.1:5000.'}
};
stopBtn.onclick=stopCamera;
function stopCamera(){if(timer)clearInterval(timer);timer=null;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;video.style.display='none';placeholder.style.display='flex';document.querySelector('.tracking-line').style.display='none';startBtn.disabled=false;stopBtn.disabled=true;cameraState.textContent='SESSION STANDBY';document.getElementById('connection').textContent='Standby';}
async function sendFrame(){if(!stream||busy||video.readyState<2)return;busy=true;
 try{canvas.width=video.videoWidth;canvas.height=video.videoHeight;ctx.save();ctx.translate(canvas.width,0);ctx.scale(-1,1);ctx.drawImage(video,0,0);ctx.restore();
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.8));const data=new FormData();data.append('image',blob,'frame.jpg');
 const res=await fetch('/predict',{method:'POST',body:data});const out=await res.json();if(out.error)throw new Error(out.error);
 document.getElementById('hands').textContent=(out.hands_detected??0)+' HAND'+((out.hands_detected??0)===1?'':'S')+' DETECTED';
 document.getElementById('handsMetric').textContent=out.hands_detected??0;
 if(out.gestures&&out.gestures.length){const g=out.gestures[0],label=g.label;document.getElementById('resultIcon').textContent=icons[label]||'✋';document.getElementById('resultLabel').textContent=label;document.getElementById('miniGesture').textContent=label.toUpperCase();document.getElementById('resultSub').textContent='Gesture identified by the pretrained AI model.';const pct=Math.round(g.score*100);document.getElementById('confidenceText').textContent=pct+'%';document.getElementById('meterFill').style.width=pct+'%';}
 else{document.getElementById('resultLabel').textContent='No gesture detected';document.getElementById('miniGesture').textContent='AWAITING INPUT';document.getElementById('resultSub').textContent=out.message||'Move your hand into the frame';document.getElementById('confidenceText').textContent='—';document.getElementById('meterFill').style.width='0%';}
 }catch(e){notice.textContent='Inference issue: '+e.message}finally{busy=false}}
window.addEventListener('beforeunload',stopCamera);
