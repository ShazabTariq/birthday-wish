/* ---------------------------
       JAVASCRIPT - interactive bits
       --------------------------- */

    // -- Replace default name (you can change text directly in HTML or here)
    const friendNameEl = document.getElementById('friendName');
    friendNameEl.textContent = "Ali"; // <-- change your friend's name here

    // Buttons
    const music = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const confettiBtn = document.getElementById('confettiBtn');
    const openMsg = document.getElementById('openMsg');

    playBtn.addEventListener('click', async () => {
      try {
        await music.play();
        playBtn.textContent = "🔊 Playing";
      } catch(e){
        alert('Browser blocked autoplay. Click Play to allow music.');
      }
    });
    pauseBtn.addEventListener('click', ()=> { music.pause(); playBtn.textContent = "▶ Play Music"; });
    muteBtn.addEventListener('click', ()=> {
      music.muted = !music.muted;
      muteBtn.textContent = music.muted ? 'Unmute' : 'Mute';
    });

    // Open message scroll
    openMsg.addEventListener('click', ()=> {
      const card = document.querySelector('.text-card');
      card.scrollIntoView({behavior:'smooth', block:'center'});
      card.style.transform = 'scale(1.01)';
      setTimeout(()=> card.style.transform='',700);
    });

    // Gallery lightbox
    document.querySelectorAll('#gallery img').forEach(img => {
      img.addEventListener('click', (e) => {
        const src = e.currentTarget.dataset.full || e.currentTarget.src;
        const lb = document.getElementById('lightbox');
        const lbimg = document.getElementById('lightboxImg');
        lbimg.src = src;
        lb.style.display = 'flex';
      });
    });
    function closeLightbox(){ document.getElementById('lightbox').style.display='none'; }

    // Confetti canvas animation (simple)
    const confettiCanvas = document.getElementById('confetti');
    const confettiCtx = confettiCanvas.getContext('2d');
    confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight;
    window.addEventListener('resize', ()=> { confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; });

    function random(min,max){ return Math.random()*(max-min)+min; }
    class Confetti {
      constructor(){
        this.x = random(0, confettiCanvas.width);
        this.y = random(confettiCanvas.height, confettiCanvas.height + 200);
        this.w = random(6,12);
        this.h = random(9,18);
        this.vx = random(-0.8,0.8);
        this.vy = random(-6,-2);
        this.color = `hsl(${Math.floor(random(0,360))} 70% 65%)`;
        this.rotation = random(0,Math.PI*2);
        this.rr = random(-0.1,0.1);
      }
      update(){
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.12;
        this.rotation += this.rr;
      }
      draw(){
        confettiCtx.save();
        confettiCtx.translate(this.x,this.y);
        confettiCtx.rotate(this.rotation);
        confettiCtx.fillStyle = this.color;
        confettiCtx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
        confettiCtx.restore();
      }
    }
    let confettis = [];
    function fireConfetti(){
      confettis = [];
      for(let i=0;i<220;i++) confettis.push( new Confetti() );
      let frames = 0;
      const id = setInterval(()=> {
        frames++;
        confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
        confettis.forEach((c,i)=> {
          c.update(); c.draw();
          if(c.y>confettiCanvas.height+40) confettis.splice(i,1);
        });
        if(frames>260){ clearInterval(id); confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height) }
      }, 16);
    }
    confettiBtn.addEventListener('click', ()=> {
      fireConfetti();
      // small celebratory sound (if you add)
    });

    // Particles background (subtle)
    const p = document.getElementById('particles');
    const pctx = p.getContext('2d');
    p.width = innerWidth; p.height = innerHeight;
    window.addEventListener('resize', ()=> { p.width = innerWidth; p.height = innerHeight; });

    const particles = [];
    for(let i=0;i<60;i++){
      particles.push({
        x: Math.random()*p.width,
        y: Math.random()*p.height,
        r: Math.random()*1.6+0.6,
        vx: (Math.random()-0.5)*0.2,
        vy: (Math.random()-0.5)*0.2,
        a: Math.random()*0.6+0.1
      });
    }
    function drawParticles(){
      pctx.clearRect(0,0,p.width,p.height);
      particles.forEach(pt=>{
        pt.x += pt.vx; pt.y += pt.vy;
        if(pt.x<0) pt.x = p.width; if(pt.x>p.width) pt.x=0;
        if(pt.y<0) pt.y = p.height; if(pt.y>p.height) pt.y=0;
        pctx.beginPath();
        pctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2);
        pctx.fillStyle = 'rgba(255,255,255,'+pt.a+')';
        pctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // Balloons float (decorative)
    for(let i=0;i<8;i++){
      const b = document.createElement('div');
      b.className='balloon';
      const left = Math.random()*100;
      const size = 48 + Math.random()*64;
      b.style.left = left + 'vw';
      b.style.width = size + 'px';
      b.style.height = (size*1.2) + 'px';
      b.style.background = `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)), hsl(${Math.random()*360},70%,65%)`;
      b.style.animationDuration = 10 + Math.random()*8 + 's';
      b.style.bottom = -Math.random()*250 + 'px';
      document.body.appendChild(b);
    }

    // Small polish: replace default placeholder images if not found
    const imgs = document.querySelectorAll('#gallery img');
    imgs.forEach(img => {
      img.onerror = function(){ this.src = 'https://via.placeholder.com/400x250?text=Photo' }
    });
    const vid = document.getElementById('heroVideo');
    vid.onerror = ()=> { /* fallback poster or hide */ }

    // Accessibility: stop music when page hidden
    document.addEventListener('visibilitychange', ()=> {
      if(document.hidden) music.pause();
    });

    // Optional: open link share prompt
    // (you can add navigator.share for mobile)
  </script>
</body>
</html>