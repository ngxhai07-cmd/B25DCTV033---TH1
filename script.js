const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* 1. Menu hamburger */
const menuBtn = $('#menuBtn'), nav = $('#nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') nav.classList.remove('open'); });

/* 2. Dark / light mode (nhớ lựa chọn bằng localStorage) */
const root = document.documentElement, themeBtn = $('#themeBtn');
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

/* 3. Hiển thị năm hiện tại ở footer */
$('#year').textContent = new Date().getFullYear();

/* 4. Hiệu ứng gõ chữ */
const words = ['Công nghệ thông tin', 'yêu thích Front-end', 'đam mê lập trình web'];
let w = 0, c = 0, del = false;
function type() {
  const word = words[w];
  $('#typed').textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; w = (w + 1) % words.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 90);
}
type();

/* 5. Scroll reveal */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
$$('.reveal').forEach((el) => io.observe(el));

/* 6. Lọc / tìm kiếm dự án theo từ khóa hoặc tag */
let activeTag = 'all';
function filterProjects() {
  const q = $('#search').value.trim().toLowerCase();
  let shown = 0;
  $$('.card').forEach((card) => {
    const okTag = activeTag === 'all' || card.dataset.tags.split(' ').includes(activeTag);
    const okText = card.textContent.toLowerCase().includes(q);
    card.classList.toggle('hide', !(okTag && okText));
    if (okTag && okText) shown++;
  });
  $('#empty').hidden = shown > 0;
}
$('#search').addEventListener('input', filterProjects);
$('#tags').addEventListener('click', (e) => {
  const b = e.target.closest('.tag'); if (!b) return;
  $$('.tag').forEach((t) => t.classList.remove('active'));
  b.classList.add('active'); activeTag = b.dataset.tag; filterProjects();
});

/* 7. Đếm ký tự trong lời nhắn */
$('#msg').addEventListener('input', (e) => { $('#count').textContent = e.target.value.length; });

/* 8. Validate form (nhiều điều kiện) */
function setErr(id, inputId, text) {
  $('#' + id).textContent = text;
  $('#' + inputId).classList.toggle('invalid', !!text);
  return !text;
}
$('#form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#name').value.trim(), email = $('#email').value.trim();
  const phone = $('#phone').value.trim(), msg = $('#msg').value.trim();
  let ok = true;
  ok = setErr('nameErr', 'name', !name ? 'Vui lòng nhập họ tên.' : name.length < 2 ? 'Họ tên cần ít nhất 2 ký tự.' : /\d/.test(name) ? 'Họ tên không được chứa số.' : '') && ok;
  ok = setErr('emailErr', 'email', !email ? 'Vui lòng nhập email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Email chưa đúng định dạng.' : '') && ok;
  ok = setErr('phoneErr', 'phone', phone && !/^0\d{9}$/.test(phone) ? 'Số điện thoại gồm 10 số, bắt đầu bằng 0.' : '') && ok;
  ok = setErr('msgErr', 'msg', !msg ? 'Vui lòng nhập lời nhắn.' : msg.length < 10 ? 'Lời nhắn cần ít nhất 10 ký tự.' : '') && ok;
  $('#ok').hidden = !ok;
  if (ok) { e.target.reset(); $('#count').textContent = 0; }
});

/* 9. Thanh tiến trình cuộn, nút lên đầu trang, highlight menu */
const sections = $$('main section[id]'), links = $$('.nav a');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  let cur = '';
  sections.forEach((s) => { if (scrollY >= s.offsetTop - 120) cur = s.id; });
  links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});
$('#topBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
