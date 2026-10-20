/* =========================================================
   Hayan Butt — Personal Website
   Shared scripts for every page
   ========================================================= */

(() => {
    'use strict';

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const page = document.body.dataset.page;

    const store = {
        get(k) { try { return localStorage.getItem(k); } catch { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } }
    };
    const session = {
        get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
        set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* unavailable */ } }
    };

    /* ---------------- Menu sounds (Web Audio, off by default) ---------------- */
    const Sound = {
        ctx: null,
        on: store.get('sound') === 'on',
        init() {
            if (!this.ctx) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (AC) this.ctx = new AC();
            }
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        },
        tone(freq, start, dur, vol = 0.05, type = 'sine') {
            const c = this.ctx;
            const o = c.createOscillator();
            const g = c.createGain();
            o.type = type;
            o.frequency.setValueAtTime(freq, c.currentTime + start);
            g.gain.setValueAtTime(0, c.currentTime + start);
            g.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
            o.connect(g).connect(c.destination);
            o.start(c.currentTime + start);
            o.stop(c.currentTime + start + dur + 0.05);
        },
        play(kind) {
            if (!this.on) return;
            this.init();
            if (!this.ctx) return;
            if (kind === 'move') this.tone(1180, 0, 0.07, 0.035, 'triangle');
            else if (kind === 'select') { this.tone(784, 0, 0.18, 0.05); this.tone(1175, 0.07, 0.3, 0.045); }
            else if (kind === 'back') { this.tone(660, 0, 0.12, 0.045); this.tone(440, 0.06, 0.2, 0.04); }
            else if (kind === 'on') { this.tone(523, 0, 0.2, 0.05); this.tone(784, 0.08, 0.25, 0.05); this.tone(1046, 0.16, 0.4, 0.05); }
        }
    };

    function initSoundToggle() {
        const btn = $('#soundBtn');
        if (!btn) return;
        const label = $('.sound-label', btn);
        const render = () => {
            btn.setAttribute('aria-pressed', String(Sound.on));
            label.textContent = Sound.on ? 'Sound on' : 'Sound off';
            btn.title = Sound.on ? 'Turn menu sounds off' : 'Turn menu sounds on';
        };
        btn.addEventListener('click', () => {
            Sound.on = !Sound.on;
            store.set('sound', Sound.on ? 'on' : 'off');
            render();
            Sound.play('on');
        });
        render();
    }

    /* ---------------- Toast ---------------- */
    let toastTimer;
    function toast(msg) {
        const el = $('#toast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
    }

    /* ---------------- Clock ---------------- */
    function initClock() {
        const el = $('#clock');
        $$('.year').forEach((y) => { y.textContent = new Date().getFullYear(); });
        if (!el) return;
        const pad = (n) => String(n).padStart(2, '0');
        const tick = () => {
            const d = new Date();
            el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
        tick();
        setInterval(tick, 10000);
    }

    /* ---------------- Page transitions ---------------- */
    function navigate(href) {
        const fade = $('#fade');
        if (reducedMotion || !fade) { window.location.href = href; return; }
        fade.classList.add('leaving');
        setTimeout(() => { window.location.href = href; }, 340);
    }

    function initTransitions() {
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[href]');
            if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const href = a.getAttribute('href');
            if (a.target === '_blank' || /^(https?:|mailto:|#)/.test(href)) {
                if (a.target === '_blank') Sound.play('select');
                return;
            }
            e.preventDefault();
            Sound.play('select');
            navigate(href);
        });
        // Restore when coming back via the browser's back button (bfcache)
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) $('#fade')?.classList.remove('leaving');
        });
        // Esc returns to the main menu from inner pages
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && page !== 'home' && !e.target.closest?.('input, textarea')) {
                Sound.play('back');
                navigate('index.html');
            }
        });
        $$('.tab, .btn, .copy-btn, .sound-btn').forEach((el) => el.addEventListener('mouseenter', () => Sound.play('move')));
    }

    /* ---------------- Background: glowing towers ---------------- */
    function initTowers() {
        const canvas = $('#bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, dpr, towers = [], particles = [], raf = null;
        const t0 = performance.now();

        const build = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const n = w < 700 ? 6 : 9;
            const gap = 1.9;
            towers = [];
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (Math.random() < 0.18) continue;
                    towers.push({
                        x: (i - (n - 1) / 2) * gap,
                        z: (j - (n - 1) / 2) * gap,
                        size: 0.45 + Math.random() * 0.25,
                        base: 0.4 + Math.random() * 2.2,
                        amp: 0.3 + Math.random() * 1.2,
                        speed: 0.15 + Math.random() * 0.35,
                        phase: Math.random() * Math.PI * 2,
                        flash: 0
                    });
                }
            }
            particles = Array.from({ length: w < 700 ? 30 : 60 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.6 + 0.4,
                vy: -(Math.random() * 0.25 + 0.05),
                tw: Math.random() * Math.PI * 2
            }));
        };

        const draw = (now) => {
            const t = (now - t0) / 1000;
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';

            const yaw = t * 0.06;
            const cos = Math.cos(yaw), sin = Math.sin(yaw);
            const camDist = 15, camH = 6.2;
            const f = Math.min(w, h) * 1.05;
            const cx = w / 2, horizon = h * 0.36;

            const project = (x, y, z) => {
                const rx = x * cos - z * sin;
                const rz = x * sin + z * cos + camDist;
                return [cx + (rx * f) / rz, horizon - ((y - camH) * f) / rz, rz];
            };

            // random tower flashes
            if (Math.random() < 0.02 && towers.length) towers[(Math.random() * towers.length) | 0].flash = 1;

            for (const tw of towers) {
                const height = Math.max(0.15, tw.base + Math.sin(t * tw.speed + tw.phase) * tw.amp);
                const s = tw.size;
                const corners = [[-s, -s], [s, -s], [s, s], [-s, s]];
                const bottom = corners.map(([dx, dz]) => project(tw.x + dx, 0, tw.z + dz));
                const top = corners.map(([dx, dz]) => project(tw.x + dx, height, tw.z + dz));
                const depth = top[0][2];
                if (depth < 1) continue;
                const fog = Math.max(0, Math.min(1, 1.25 - (depth - 7) / 16));
                const flash = tw.flash;
                tw.flash *= 0.96;

                // sides
                ctx.fillStyle = `rgba(30, 80, 255, ${(0.05 + flash * 0.12) * fog})`;
                ctx.strokeStyle = `rgba(110, 170, 255, ${(0.12 + flash * 0.35) * fog})`;
                ctx.lineWidth = 1;
                for (let k = 0; k < 4; k++) {
                    const a = bottom[k], b = bottom[(k + 1) % 4], c = top[(k + 1) % 4], d = top[k];
                    ctx.beginPath();
                    ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
                // glowing top
                ctx.fillStyle = `rgba(120, 190, 255, ${(0.12 + flash * 0.4) * fog})`;
                ctx.beginPath();
                ctx.moveTo(top[0][0], top[0][1]);
                for (let k = 1; k < 4; k++) ctx.lineTo(top[k][0], top[k][1]);
                ctx.closePath();
                ctx.fill();
            }

            // floating particles
            for (const p of particles) {
                p.y += p.vy;
                p.tw += 0.03;
                if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
                const a = 0.25 + Math.sin(p.tw) * 0.2;
                ctx.fillStyle = `rgba(150, 205, 255, ${a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
            if (!reducedMotion) raf = requestAnimationFrame(draw);
        };

        build();
        let rt;
        window.addEventListener('resize', () => {
            clearTimeout(rt);
            rt = setTimeout(() => { build(); if (reducedMotion) draw(performance.now()); }, 150);
        });
        document.addEventListener('visibilitychange', () => {
            if (reducedMotion) return;
            if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
            else if (!raf) raf = requestAnimationFrame(draw);
        });
        raf = requestAnimationFrame(draw);
    }

    /* ---------------- Startup sequence (home, once per visit) ---------------- */
    function initBoot() {
        const boot = $('#boot');
        if (!boot) return;
        if (reducedMotion || session.get('booted')) { boot.remove(); return; }
        session.set('booted', '1');

        const cubes = $('#bootCubes');
        for (let i = 0; i < 18; i++) {
            const c = document.createElement('i');
            const angle = Math.random() * Math.PI * 2;
            const dist = 280 + Math.random() * 400;
            c.style.left = '50%';
            c.style.top = '50%';
            c.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
            c.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
            c.style.animationDelay = `${Math.random() * 0.6}s`;
            cubes.appendChild(c);
        }
        boot.classList.add('run');
        document.body.style.overflow = 'hidden';

        const done = () => {
            if (!boot.isConnected) return;
            document.body.style.overflow = '';
            boot.remove();
        };
        boot.addEventListener('animationend', (e) => { if (e.target === boot) done(); });
        const skip = () => {
            boot.style.transition = 'opacity .4s';
            boot.style.opacity = '0';
            setTimeout(done, 400);
        };
        boot.addEventListener('click', skip);
        document.addEventListener('keydown', function onKey() {
            skip();
            document.removeEventListener('keydown', onKey);
        });
        setTimeout(done, 5000); // safety net
    }

    /* ---------------- Main menu (home) ---------------- */
    function initMainMenu() {
        const menu = $('[data-menu]');
        if (!menu) return;
        const items = $$('.menu-item', menu);
        let index = 0;

        const select = (i, silent) => {
            index = (i + items.length) % items.length;
            items.forEach((it, k) => it.classList.toggle('is-selected', k === index));
            if (!silent) Sound.play('move');
        };

        items.forEach((it, i) => {
            it.addEventListener('mouseenter', () => { if (index !== i) select(i); });
            it.addEventListener('focus', () => { if (index !== i) select(i, true); });
        });

        document.addEventListener('keydown', (e) => {
            if ($('#boot')) return;
            if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); select(index + 1); }
            else if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); select(index - 1); }
            else if (e.key === 'Enter' && !e.target.closest?.('a, button')) { e.preventDefault(); items[index].click(); }
        });
    }

    /* ---------------- Projects browser ---------------- */
    function cubeHTML(color, icon) {
        const svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>`;
        return `<div class="cube" style="--c:${color}">
            <div class="face f1">${svg}</div><div class="face f2">${svg}</div>
            <div class="face f3">${svg}</div><div class="face f4">${svg}</div>
            <div class="face f5"></div><div class="face f6"></div></div>`;
    }

    function initProjects() {
        const grid = $('#mcGrid');
        const detail = $('#mcDetail');
        const data = window.PROJECTS;
        if (!grid || !detail || !Array.isArray(data)) return;

        grid.innerHTML = data.map((p, i) => `
            <button type="button" class="mc-item" role="option" aria-selected="false" data-i="${i}">
                <span class="cube-stage">${cubeHTML(p.color, p.icon)}</span>
                <span class="cube-shadow" style="--c:${p.color}"></span>
                <span class="mc-name">${p.name}</span>
            </button>`).join('');
        const items = $$('.mc-item', grid);
        let current = -1;

        const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';

        const show = (i, opts = {}) => {
            if (i === current) return;
            current = (i + data.length) % data.length;
            const p = data[current];
            items.forEach((it, k) => {
                it.classList.toggle('is-selected', k === current);
                it.setAttribute('aria-selected', String(k === current));
            });
            detail.innerHTML = `
                <div class="mc-detail-head">
                    <span class="cube-stage">${cubeHTML(p.color, p.icon)}</span>
                    <div>
                        <h2>${p.name}</h2>
                        <span class="status ${p.status[0]}">${p.status[1]}</span>
                    </div>
                </div>
                <div class="mc-detail-body">
                    <p class="mc-desc">${p.description}</p>
                    <ul class="mc-points">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
                    <dl class="mc-info">${p.info.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
                    <div class="mc-actions">
                        ${p.links.length
                            ? p.links.map(([label, url], k) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="btn ${k === 0 ? 'btn-primary' : 'btn-glass'}">${label} ${arrow}</a>`).join('')
                            : '<span class="chips-note">Personal project — no public code.</span>'}
                    </div>
                </div>`;
            detail.classList.remove('swap');
            void detail.offsetWidth;
            detail.classList.add('swap');
            if (!opts.silent) Sound.play('move');
            if (opts.scroll && window.innerWidth <= 980) {
                detail.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
            }
            try { history.replaceState(null, '', '#' + p.id); } catch { /* file:// */ }
        };

        items.forEach((it, i) => it.addEventListener('click', () => show(i, { scroll: true })));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); items[current].focus({ preventScroll: true }); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); items[current].focus({ preventScroll: true }); }
        });

        const fromHash = data.findIndex((p) => '#' + p.id === window.location.hash);
        show(fromHash >= 0 ? fromHash : 0, { silent: true });

        const capText = $('#capText');
        const capBar = $('#capBar');
        if (capText) capText.textContent = `${data.length} PROJECTS`;
        if (capBar) setTimeout(() => { capBar.style.width = Math.min(100, data.length * 12) + '%'; }, 600);
    }

    /* ---------------- Copy email ---------------- */
    function initCopy() {
        $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            try {
                await navigator.clipboard.writeText(text);
            } catch {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;opacity:0';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); } catch { /* ignore */ }
                ta.remove();
            }
            Sound.play('select');
            btn.classList.add('copied');
            btn.textContent = 'Copied!';
            toast('Email copied to clipboard');
            setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy'; }, 1800);
        }));
    }

    /* ---------------- Boot everything ---------------- */
    initBoot();
    initClock();
    initSoundToggle();
    initTransitions();
    initTowers();
    initMainMenu();
    initProjects();
    initCopy();
})();
